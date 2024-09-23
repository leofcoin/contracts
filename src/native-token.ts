import { IToken } from '@leofcoin/standards/interfaces/i-token'
import Token, { TokenState } from '@leofcoin/standards/token.js'

export default class Leofcoin extends Token implements IToken {
  constructor(state: TokenState) {
    super('Leofcoin', 'LFC', 18, state)
  }
}
