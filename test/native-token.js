import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Leofcoin from './../exports/native-token.js'
import Token from '@leofcoin/standards/token.js'

use(chaiAsPromised)

describe('Leofcoin', () => {
  let state
  let token
  const receiverAddress = '0xReceiverAddress'
  const otherReceiverAddress = '0xOtherReceiverAddress'
  const ownerAddress = '0xOwnerAddress'

  beforeEach(() => {
    global.msg = {
      sender: ownerAddress,
      contract: '0xContractAddress',
      staticCall: async (currency, method, args) => {
        // Mock implementation of msg.staticCall
      },
      call: async (currency, method, args) => {
        // Mock implementation of msg.call
      }
    }

    token = new Leofcoin()
  })

  it('should create an instance of Leofcoin', () => {
    expect(token).to.be.instanceOf(Leofcoin)
  })

  it('should have correct properties', () => {
    expect(token.name).to.equal('Leofcoin')
    expect(token.symbol).to.equal('LFC')
    expect(token.decimals).to.equal(18)
  })

  it('should grant MINT role to owner', async () => {
    await token.grantRole(ownerAddress, 'MINT')
    expect(await token.hasRole(ownerAddress, 'MINT')).to.equal(true)
  })

  it('should be able to mint', async () => {
    await token.grantRole(ownerAddress, 'MINT')
    await token.mint(ownerAddress, 100000n)
    expect(token.balanceOf(ownerAddress)).to.equal(100000n)
  })

  it('should be able to transfer', async () => {
    await token.grantRole(ownerAddress, 'MINT')
    await token.mint(receiverAddress, 100000n)
    msg.sender = receiverAddress
    await token.transfer(receiverAddress, otherReceiverAddress, 10000n)
    expect(token.balanceOf(receiverAddress)).to.equal(90000n)
    expect(token.balanceOf(otherReceiverAddress)).to.equal(10000n)
  })

  it('should be able to burn', async () => {
    await token.grantRole(ownerAddress, 'BURN')
    await token.grantRole(ownerAddress, 'MINT')
    await token.mint(ownerAddress, 100000n)
    await token.burn(ownerAddress, 10000n)
    expect(token.balanceOf(ownerAddress)).to.equal(90000n)
  })

  it('should not be able to burn more than balance', async () => {
    await token.grantRole(ownerAddress, 'MINT')
    await token.mint(ownerAddress, 100000n)

    try {
      await token.burn(ownerAddress, 100001n)
    } catch (error) {
      expect(error.message).to.equal('amount exceeds balance')
    }
  })

  it('should not be able to mint if not MINT role', async () => {
    try {
      await token.mint(ownerAddress, 100000n)
    } catch (error) {
      expect(error.message).to.equal('mint role required')
    }
  })

  it('should not be able to transfer more than balance', async () => {
    await token.grantRole(ownerAddress, 'MINT')
    await token.mint(receiverAddress, 100000n)
    try {
      await token.transfer(receiverAddress, otherReceiverAddress, 100001n)
    } catch (error) {
      expect(error.message).to.equal('amount exceeds balance')
    }
  })
})
