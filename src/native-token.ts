import Token from '@leofcoin/standards/token.js'

export default class ArtOnline extends Token {
  constructor(state: {}) {
    super('ArtOnline', 'ART', 18, state)
  }
}
