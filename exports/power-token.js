class ContractCreator{#creator;constructor(state){this.#creator=state?state.contractCreator:msg.sender}get _contractCreator(){return this.#creator}get state(){return{contractCreator:this.#creator}}get _isContractCreator(){return msg.sender===this.#creator}}class Roles extends ContractCreator{#roles={OWNER:[],MINT:[],BURN:[]};constructor(state){if(super(state),state?.roles){if(!(state.roles instanceof Object))throw new TypeError("expected roles to be an object");this.#roles={...state.roles,...this.#roles}}else this.#grantRole(msg.sender,"OWNER")}get state(){return{...super.state,roles:this.roles}}get roles(){return{...this.#roles}}hasRole(address,role){return!!this.#roles[role]&&this.#roles[role].includes(address)}#grantRole(address,role){if(this.hasRole(address,role))throw new Error(`${role} role already granted for ${address}`);this.#roles[role].push(address)}#revokeRole(address,role){if(!this.hasRole(address,role))throw new Error(`${role} role already revoked for ${address}`);if("OWNER"===role&&1===this.#roles[role].length)throw new Error("atleast one owner is needed!");this.#roles[role].splice(this.#roles[role].indexOf(address))}grantRole(address,role){if(!this.hasRole(address,"OWNER"))throw new Error("Not allowed");this.#grantRole(address,role)}revokeRole(address,role){if(!this.hasRole(address,"OWNER"))throw new Error("Not allowed");this.#revokeRole(address,role)}}class Token extends Roles{#name;#symbol;#holders=BigNumber.from(0);#balances={};#approvals={};#decimals=18;#totalSupply=BigNumber.from(0);constructor(name,symbol,decimals=18,state){if(!name)throw new Error("name undefined");if(!symbol)throw new Error("symbol undefined");super(state),state?(this.#balances=(balances=>{const _balances={};for(const address in balances)_balances[address]=BigNumber.from(balances[address]);return _balances})(state.balances),this.#approvals=(approvals=>{const _approvals={};for(const owner in approvals){_approvals[owner]={};for(const operator in approvals[owner])_approvals[owner][operator]=BigNumber.from(approvals[owner][operator])}return _approvals})(state.approvals),this.#holders=BigNumber.from(state.holders),this.#totalSupply=BigNumber.from(state.totalSupply)):(this.#name=name,this.#symbol=symbol,this.#decimals=decimals)}get state(){return{...super.state,holders:this.holders,balances:this.balances,approvals:{...this.#approvals},totalSupply:this.totalSupply}}get totalSupply(){return this.#totalSupply}get name(){return this.#name}get symbol(){return this.#symbol}get holders(){return this.#holders}get balances(){return{...this.#balances}}get approvals(){return this.#approvals}get decimals(){return this.#decimals}mint(to,amount){if(!this.hasRole(msg.sender,"MINT"))throw new Error("not allowed");this.#totalSupply=this.#totalSupply.add(amount),this.#increaseBalance(to,amount)}burn(from,amount){if(!this.hasRole(msg.sender,"BURN"))throw new Error("not allowed");this.#totalSupply=this.#totalSupply.sub(amount),this.#decreaseBalance(from,amount)}#beforeTransfer(from,to,amount){if(!this.#balances[from]||this.#balances[from]<amount)throw new Error("amount exceeds balance")}#updateHolders(address,previousBalance){"0x00"===this.#balances[address].toHexString()?this.#holders.sub(1):"0x00"!==this.#balances[address].toHexString()&&"0x00"===previousBalance.toHexString()&&this.#holders.add(1)}#increaseBalance(address,amount){this.#balances[address]||(this.#balances[address]=BigNumber.from(0));const previousBalance=this.#balances[address];this.#balances[address]=this.#balances[address].add(amount),this.#updateHolders(address,previousBalance)}#decreaseBalance(address,amount){const previousBalance=this.#balances[address];this.#balances[address]=this.#balances[address].sub(amount),this.#updateHolders(address,previousBalance)}balance(){return this.#balances[msg.sender]}balanceOf(address){return this.#balances[address]}setApproval(operator,amount){const owner=msg.sender;this.#approvals[owner]||(this.#approvals[owner]={}),this.#approvals[owner][operator]=BigNumber.from(amount)}approved(owner,operator,amount){return this.#approvals[owner][operator]===amount}transfer(from,to,amount){amount=BigNumber.from(amount),this.#beforeTransfer(from,to,amount),this.#decreaseBalance(from,amount),this.#increaseBalance(to,amount)}}class Power extends Token{constructor(state){super("Power","PWR",18,state)}}export{Power as default};
