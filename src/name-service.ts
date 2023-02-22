type registry = {
  name: {
    address: address,
    owner: address
  }
}

export default class NameService {
  /**
   * string
   */
  #name: string = 'ArtOnlineNameService'
  /**
   * string
   */
  #owner: address
  /**
   * number
   */
  #price: BigNumberish = 0
  /**
   * Object => string
   */
  #registry: registry

  /**
   * => string
   */
  #currency: address

  get name(): string {
    return this.#name
  }

  get registry(): {} {
    return {...this.#registry}
  }

  get state() {
    return {
      owner: this.#owner,
      registry: this.#registry,
      currency: this.#currency,
      price: this.#price
    }
  }

  // TODO: control with contract
  constructor(factoryAddress: address, currency: address, validatorAddress: address, price: BigNumberish, state: { owner: address; registry: registry; currency: address; price: BigNumberish }) {
    if (state) {
      this.#owner = state.owner
      this.#registry = state.registry
      this.#currency = state.currency
      this.#price = state.price
    } else {
      this.#owner = msg.sender
      this.#price = price
      this.#registry['ArtOnlineContractFactory'] = {
        owner: msg.sender,
        address: factoryAddress
      }

      this.#registry['ArtOnlineToken'] = {
        owner: msg.sender,
        address: currency
      }

      this.#registry['ArtOnlineValidators'] = {
        owner: msg.sender,
        address: validatorAddress
      }

      this.#currency = currency
    }
  }

  changeOwner(owner: any) {
    if (msg.sender !== this.#owner) throw new Error('no owner')
    this.#owner = owner
  }

  changePrice(price: number) {
    if (msg.sender !== this.#owner) throw new Error('no owner')
    this.#price = price
  }

  changeCurrency(currency: any) {
    if (msg.sender !== this.#owner) throw new Error('no owner')
    this.#currency = currency
  }

  async purchaseName(name: string | number, address: any) {
    const balance = await msg.call(this.#currency, 'balanceOf', [msg.sender])
    if (balance < this.#price) throw new Error('price exceeds balance')
    try {
      await msg.call(this.#currency, 'transfer', [msg.sender, this.#owner, this.#price])
    } catch (error) {
      throw error
    }

    this.#registry[name] = {
      owner: msg.sender,
      address
    }
  }

  lookup(name: string | number) {
    return this.#registry[name]
  }

  transferOwnership(name: string | number, to: any) {
    if (msg.sender !== this.#registry[name].owner) throw new Error('not a owner')
    this.#registry[name].owner = to
  }

  changeAddress(name: string | number, address: any) {
    if (msg.sender !== this.#registry[name].owner) throw new Error('not a owner')
    this.#registry[name].address = address
  }
}
