import Factory from './../exports/factory.js'
import { expect } from 'chai'

describe('Factory', () => {
  let factory

  beforeEach(() => {
    global.msg = {
      sender: '0xOwnerAddress',
      contract: '0xContractAddress',
      staticCall: async (currency, method, args) => {
        console.log(currency, method, args)
        if (method === 'balanceOf') {
          return BigInt(100000)
        } else if (method === '_isContractCreator') {
          return true
        }
      },
      call: async (currency, method, args) => {
        console.log(currency, method, args)

        if (method === 'balanceOf') {
          return BigInt(100000)
        } else if (method === '_isContractCreator') {
          return true
        }
      }
    }
    factory = new Factory('0xTokenAddress', BigInt(1000))
  })

  it('should throw an error if balance is too low', async () => {
    factory._canPay = () => false
    try {
      await factory.registerContract('0xContractAddress')
    } catch (error) {
      expect(error.message).to.equal("can't register, balance to low")
    }
  })

  it('should throw an error if address is not a contract creator', async () => {
    factory._canPay = () => true
    factory.isCreator = async () => false
    try {
      await factory.registerContract('0xContractAddress')
    } catch (error) {
      expect(error.message).to.equal("You don't own that contract")
    }
  })

  it('should throw an error if contract is already registered', async () => {
    await factory.registerContract('0xContractAddress')
    try {
      await factory.registerContract('0xContractAddress')
    } catch (error) {
      expect(error.message).to.equal('already registered')
    }
  })

  it('should successfully register a contract', async () => {
    await factory.registerContract('0xContractAddress')

    expect(factory.totalContracts).to.equal(BigInt(1))
    expect(factory.contracts).to.include('0xContractAddress')
  })
})
