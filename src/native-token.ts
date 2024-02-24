import Token, { TokenState } from '@leofcoin/standards/token.js';

export default class Leofcoin extends Token {
  constructor(state: TokenState) {
    super('Leofcoin', 'LFC', 18, state);
  }
}
