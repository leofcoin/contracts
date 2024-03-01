import { PublicVoting, TokenReceiver } from '@leofcoin/standards'
import type { PublicVotingState } from '@leofcoin/standards/public-voting'
import { TokenReceiverState } from '@leofcoin/standards/token-receiver'

export interface FactoryState extends TokenReceiverState {
  contracts: any[]
  totalContracts: typeof BigNumber
}

export default class Factory extends TokenReceiver {
  /**
   * string
   */
  #name = 'LeofcoinContractFactory'
  /**
   * uint
   */
  #totalContracts: typeof BigNumber = BigNumber['from'](0)
  /**
   * Array => string
   */
  #contracts: address[] = []

  constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, state: FactoryState) {
    super(tokenToReceive, tokenAmountToReceive, true, state as TokenReceiverState)
    if (state) {
      this.#contracts = state.contracts
      this.#totalContracts = state.totalContracts
    }
  }

  get state(): PublicVotingState {
    return {
      ...super.state,
      totalContracts: this.#totalContracts,
      contracts: this.#contracts
    }
  }

  get name() {
    return this.#name
  }

  get contracts() {
    return [...this.#contracts]
  }

  get totalContracts() {
    return this.#totalContracts
  }

  isRegistered(address: any) {
    return this.#contracts.includes(address)
  }

  #isCreator(address: address) {
    return msg.staticCall(address, '_isContractCreator')
  }

  /**
   *
   * @param {Address} address contract address to register
   */
  async registerContract(address: string) {
    if (!this._canPay()) throw new Error(`can't register, balance to low`)

    if (!(await this.#isCreator(address))) throw new Error(`You don't own that contract`)
    if (this.#contracts.includes(address)) throw new Error('already registered')
    await this._payTokenToReceive()
    this.#totalContracts.add(1)
    this.#contracts.push(address)
  }
}
