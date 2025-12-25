import Token, { TokenState } from '@leofcoin/standards/token.js';
export default class Leofcoin extends Token {
    constructor(state: TokenState);
    burn(from: address, amount: bigint): void;
}
