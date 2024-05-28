import Roles from '@leofcoin/standards/roles.js';
export default class Validators extends Roles {
    #private;
    get state(): {
        minimumBalance: import("@ethersproject/bignumber").BigNumber;
        currency: string;
        validators: string[];
        roles: {
            [index: string]: string[];
        };
        contractCreator: string;
    };
    constructor(tokenAddress: address, state: any);
    get name(): string;
    get currency(): string;
    get validators(): string[];
    get totalValidators(): number;
    get minimumBalance(): import("@ethersproject/bignumber").BigNumber;
    changeCurrency(currency: any): void;
    has(validator: any): boolean;
    addValidator(validator: address): Promise<void>;
    removeValidator(validator: any): Promise<void>;
    shuffleValidator(): void;
}
