import Roles from '@leofcoin/standards/roles.js'

export default class Validators extends Roles {
  /**
   * string
   */
  #name = 'LeofcoinValidators'
  /**
   * Object => string(address) => Object
   */
  #validators: address[] = []

  #currency: address

  #minimumBalance: typeof BigNumber

  get state() {
    return {
      ...super.state,
      minimumBalance: this.#minimumBalance,
      currency: this.#currency,
      validators: this.#validators
    }
  }

  constructor(tokenAddress: address, state) {
    super(state?.roles)
    if (state) {
      this.#minimumBalance = BigNumber['from'](state.minimumBalance)
      this.#currency = state.currency
      this.#validators = state.validators
    } else {
      this.#minimumBalance = new BigNumber['from'](50_000)
      this.#currency = tokenAddress
      this.#validators.push(msg.sender)
    }
  }

  get name() {
    return this.#name
  }

  get currency() {
    return this.#currency
  }

  get validators() {
    return [...this.#validators]
  }

  get totalValidators() {
    return this.#validators.length
  }

  get minimumBalance() {
    return this.#minimumBalance
  }

  changeCurrency(currency) {
    if (!this.hasRole(msg.sender, 'OWNER')) throw new Error('not an owner')
    this.#currency = currency
  }

  has(validator) {
    return this.#validators.includes(validator)
  }

  #isAllowed(address) {
    if (msg.sender !== address && !this.hasRole(msg.sender, 'OWNER'))
      throw new Error('sender is not the validator or owner')
    return true
  }

  async addValidator(validator: address) {
    this.#isAllowed(validator)
    if (this.has(validator)) throw new Error('already a validator')

    const balance = await msg.staticCall(this.currency, 'balanceOf', [validator])

    if (this.minimumBalance.gt(balance))
      throw new Error(`balance to low! got: ${balance} need: ${this.#minimumBalance}`)

    this.#validators.push(validator)
  }

  removeValidator(validator) {
    this.#isAllowed(validator)
    if (!this.has(validator)) throw new Error('validator not found')
    this.#validators.splice(this.#validators.indexOf(validator))
  }
}
