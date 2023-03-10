export default class Factory {
  /**
   * string
   */
  #name = 'ArtOnlineContractFactory'
  /**
   * uint
   */
  #totalContracts = 0
  /**
   * Array => string
   */
  #contracts = []

  constructor(state: { contracts: any[]; totalContracts: number }) {
    if (state) {
      this.#contracts = state.contracts
      this.#totalContracts = state.totalContracts
    }
  }

  get state() {
    return {
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

  /**
   * 
   * @param {Address} address contract address to register
   */
  async registerContract(address: string) {
    await msg.staticCall(address, 'hasRole', [msg.sender, 'OWNER'])
    if (this.#contracts.includes(address)) throw new Error('already registered')

    this.#totalContracts += 1
    this.#contracts.push(address)
  }
}
