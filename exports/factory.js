class PublicVoting{#votes;#votingDisabled;#votingDuration=1728e5;constructor(state){state&&(this.#votes=state.votes,this.#votingDisabled=state.votingDisabled)}get votes(){return{...this.#votes}}get votingDuration(){return this.#votingDuration}get votingDisabled(){return this.#votingDisabled}get state(){return{votes:this.#votes,votingDisabled:this.#votingDisabled,votingDuration:this.#votingDuration}}get inProgress(){return Object.entries(this.#votes).filter((([id,vote])=>!vote.finished)).map((([id,vote])=>({...vote,id:id})))}createVote(title,description,endTime,method,args=[]){if(!this.#canVote())throw new Error("Not allowed to create a vote");const id=crypto.randomUUID();this.#votes[id]={title:title,description:description,method:method,endTime:endTime,args:args}}#canVote(){return this._canVote?.()}#beforeVote(){return this._beforeVote?.()}#endVoting(voteId){let agree=Object.values(this.#votes[voteId].results).filter((result=>1===result)),disagree=Object.values(this.#votes[voteId].results).filter((result=>0===result));agree.length>disagree.length&&this.#votes[voteId].enoughVotes&&this[this.#votes[voteId].method](...this.#votes[voteId].args),this.#votes[voteId].finished=!0}async vote(voteId,vote){if(0!==(vote=Number(vote))&&.5!==vote&&1!==vote)throw new Error(`invalid vote value ${vote}`);if(!this.#votes[voteId])throw new Error(`Nothing found for ${voteId}`);const ended=(new Date).getTime()>this.#votes[voteId].endTime;if(ended&&!this.#votes[voteId].finished&&this.#endVoting(voteId),ended)throw new Error("voting already ended");if(!this.#canVote())throw new Error("Not allowed to vote");await this.#beforeVote(),this.#votes[voteId][msg.sender]=vote}#disableVoting(){this.#votingDisabled=!0}disableVoting(){if(!this.#canVote())throw new Error("not a allowed");this.createVote("disable voting","Warning this disables all voting features forever",(new Date).getTime()+this.#votingDuration,"#disableVoting",[])}_sync(){for(const vote of this.inProgress)vote.endTime<(new Date).getTime()&&this.#endVoting(vote.id)}}class TokenReceiver extends PublicVoting{#tokenToReceive;#tokenAmountToReceive;#tokenReceiver;#voteType="transfer";constructor(tokenToReceive,tokenAmountToReceive,burns,state){super(state),state?(this.#tokenReceiver=state.tokenReceiver,this.#tokenToReceive=state.tokenToReceive,this.#tokenAmountToReceive=BigNumber.from(state.tokenAmountToReceive),this.#voteType=state.voteType):(this.#tokenReceiver=msg.contract,this.#tokenToReceive=tokenToReceive,this.#tokenAmountToReceive=BigNumber.from(tokenAmountToReceive),burns&&(this.#voteType="burn"))}get tokenToReceive(){return this.#tokenToReceive}get tokenAmountToReceive(){return this.#tokenAmountToReceive}get tokenReceiver(){return this.#tokenReceiver}get state(){return{...super.state,tokenReceiver:this.#tokenReceiver,tokenToReceive:this.#tokenToReceive,tokenAmountToReceive:this.#tokenAmountToReceive,voteType:this.#voteType}}async#canVote(){return(await msg.staticCall(this.#tokenToReceive,"balanceOf",[msg.sender])).gte(this.#tokenAmountToReceive)}async _canVote(){return this.#canVote()}async#beforeVote(){return"burn"===this.#voteType?msg.staticCall(this.tokenToReceive,"burn",[this.tokenAmountToReceive]):msg.staticCall(this.tokenToReceive,"transfer",[msg.sender,this.tokenReceiver,this.tokenAmountToReceive])}async _beforeVote(){await this.#beforeVote()}async _payTokenToReceive(){return msg.staticCall(this.#tokenToReceive,"transfer",[msg.sender,this.#tokenReceiver,this.#tokenAmountToReceive])}async _burnTokenToReceive(){return msg.staticCall(this.#tokenToReceive,"burn",[this.#tokenAmountToReceive])}async _canPay(){return(await msg.call(this.#tokenToReceive,"balance",[])).gte(this.tokenAmountToReceive)}#changeTokenToReceive(address){this.#tokenToReceive=address}#changeTokenAmountToReceive(amount){this.#tokenAmountToReceive=amount}#changeVoteType(type){this.#voteType=type}#getTokensOut(amount,receiver){return msg.call(this.#tokenReceiver,"transfer",[this.#tokenReceiver,receiver,amount])}async changeVoteType(type){if(!this.#canVote())throw new Error("not a allowed");if("transfer"===this.#voteType&&(await this.#balance()).gt(0))throw new Error("get tokens out first or they be lost forever");this.createVote("change the token amount to receive","set tokenAmountToReceive",(new Date).getTime()+this.votingDuration,"#changeVoteType",[type])}getTokensOut(amount,receiver){if(!this.#canVote())throw new Error("not a allowed");this.createVote("withdraw all tokens",`withdraw all tokens to ${receiver}`,(new Date).getTime()+this.votingDuration,"#getTokensOut",[amount,receiver])}changeTokenAmountToReceive(){if(!this.#canVote())throw new Error("not a allowed");this.createVote("change the token amount to receive","set tokenAmountToReceive",(new Date).getTime()+this.votingDuration,"#changeTokenAmountToReceive",[])}#balance(){return msg.staticCall(this.#tokenToReceive,"balanceOf",[this.#tokenReceiver])}async changeTokenToReceive(){if(!this.#canVote())throw new Error("not a allowed");if(!(await this.#balance()).eq(0)&&"transfer"===this.#voteType)throw new Error("get tokens out first or they be lost forever");this.createVote("change the token to receive","set tokenToReceive to a new address",(new Date).getTime()+this.votingDuration,"#changeTokenToReceive",[])}}class Factory extends TokenReceiver{#name="LeofcoinContractFactory";#totalContracts=BigNumber.from(0);#contracts=[];constructor(tokenToReceive,tokenAmountToReceive,state){super(tokenToReceive,tokenAmountToReceive,!0,state),state&&(this.#contracts=state.contracts,this.#totalContracts=state.totalContracts)}get state(){return{...super.state,totalContracts:this.#totalContracts,contracts:this.#contracts}}get name(){return this.#name}get contracts(){return[...this.#contracts]}get totalContracts(){return this.#totalContracts}isRegistered(address){return this.#contracts.includes(address)}#isOwner(address){return msg.staticCall(address,"hasRole",[msg.sender,"OWNER"])}async registerContract(address){if(!this._canPay())throw new Error("can't register, balance to low");if(!await this.#isOwner(address))throw new Error("You don't own that contract");if(this.#contracts.includes(address))throw new Error("already registered");await this._payTokenToReceive(),this.#totalContracts.add(1),this.#contracts.push(address)}}export{Factory as default};
