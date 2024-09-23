import { IToken } from '@leofcoin/standards/interfaces/i-token'
import Token, { TokenState } from '@leofcoin/standards/token.js'

export default class Power extends Token implements IToken {
  constructor(state: TokenState) {
    super('Power', 'PWR', 18, state)
  }
}
