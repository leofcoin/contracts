import Roles from '@leofcoin/standards/roles.js';
import type { RolesState } from '@leofcoin/standards/interfaces.js';
export declare interface ValidatorsState extends RolesState {
    balances: {
        [address: string]: bigint;
    };
    minimumBalance: bigint;
    currency: address;
    validators: address[];
    currentValidator: address;
}
export default class Validators extends Roles {
    #private;
    get state(): {
        balances: {
            [address: string]: bigint;
        };
        minimumBalance: bigint;
        currency: string;
        validators: string[];
        currentValidator: string;
    };
    constructor(tokenAddress: address, state: ValidatorsState);
    get currentValidator(): string;
    get name(): string;
    get currency(): string;
    get validators(): string[];
    get totalValidators(): number;
    get minimumBalance(): bigint;
    changeCurrency(currency: any): void;
    has(validator: any): boolean;
    addValidator(validator: address): Promise<void>;
    removeValidator(validator: any): Promise<void>;
    shuffleValidator(): void;
}
