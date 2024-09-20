import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, beforeEach } from 'mocha'
import Validators from '../exports/validators.js'

use(chaiAsPromised)

describe('Validators', () => {
  let validators
  let validatorState
  const tokenAddress = '0xTokenAddress'
  const ownerAddress = '0xOwnerAddress'
  const validatorAddress = '0xValidatorAddress'
  const anotherValidatorAddress = '0xAnotherValidatorAddress'

  beforeEach(() => {
    global.state = {
      peers: [
        [ownerAddress, { bw: { up: 100, down: 100 } }],
        [validatorAddress, { bw: { up: 100, down: 100 } }],
        [anotherValidatorAddress, { bw: { up: 200, down: 200 } }]
      ]
    }
    global.msg = {
      sender: ownerAddress,
      contract: '0xContractAddress',
      staticCall: async (currency, method, args) => {
        if (method === 'balanceOf') {
          if (args[0] === validatorAddress) return BigInt(100000)
          if (args[0] === anotherValidatorAddress) return BigInt(100000)
        }
        return BigInt(0)
      },
      call: async (currency, method, args) => {
        // Mock implementation of msg.call
      }
    }
    validators = new Validators(tokenAddress, validatorState)
  })

  it('should initialize with default values', () => {
    expect(validators.name).to.equal('LeofcoinValidators')
    expect(validators.currency).to.equal(tokenAddress)
    expect(validators.validators).to.deep.equal([ownerAddress])
    expect(validators.totalValidators).to.equal(1)
    expect(validators.minimumBalance.toString()).to.equal(BigInt(50000).toString())
  })

  it('should change currency if sender is owner', () => {
    validators.changeCurrency('0xNewCurrencyAddress')
    expect(validators.currency).to.equal('0xNewCurrencyAddress')
  })

  it('should throw error if non-owner tries to change currency', () => {
    global.msg.sender = validatorAddress
    expect(() => validators.changeCurrency('0xNewCurrencyAddress')).to.throw('not an owner')
  })

  it('should add a validator if conditions are met', async () => {
    await validators.addValidator(validatorAddress)
    expect(validators.validators).to.include(validatorAddress)
    expect(validators.totalValidators).to.equal(2)
  })

  it('should throw error if adding an existing validator', async () => {
    await validators.addValidator(validatorAddress)
    await expect(validators.addValidator(validatorAddress)).to.be.rejectedWith(
      'validator already exists'
    )
  })

  it('should throw error if validator balance is too low', async () => {
    global.msg.staticCall = async (currency, method, args) => BigInt(1000)
    await expect(validators.addValidator(anotherValidatorAddress)).to.be.rejectedWith(
      'balance to low! got: 1000 need: 50000'
    )
  })

  it('should remove a validator if conditions are met', async () => {
    await validators.addValidator(validatorAddress)
    await validators.removeValidator(validatorAddress)
    expect(validators.validators).to.not.include(validatorAddress)
    expect(validators.totalValidators).to.equal(1)
  })

  it('should throw error if removing a non-existing validator', async () => {
    await expect(validators.removeValidator(validatorAddress)).to.be.rejectedWith(
      'validator not found'
    )
  })

  it('should shuffle validator correctly', async () => {
    validators.shuffleValidator()
    expect(validators.currentValidator).to.include(ownerAddress)
    await validators.removeValidator(ownerAddress)

    global.msg.sender = validatorAddress
    await validators.addValidator(validatorAddress)

    validators.shuffleValidator()
    expect(validators.currentValidator).to.include(validatorAddress)
  })

  it('should return the current validator', () => {
    expect(validators.currentValidator).to.equal(ownerAddress)
  })

  it('should return state correctly', async () => {
    msg.sender = validatorAddress
    await validators.addValidator(validatorAddress)
    validatorState = validators.state
    expect(validatorState.validators).to.deep.equal([ownerAddress, validatorAddress])
  })

  it('should restore from state correctly', () => {
    const newValidators = new Validators(tokenAddress, validatorState)
    expect(newValidators.validators).to.deep.equal([ownerAddress, validatorAddress])
    expect(newValidators.totalValidators).to.equal(2)
  })
})
