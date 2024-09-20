import Roles, { RolesState } from '@leofcoin/standards/roles.js';
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
        roles: {
            [index: string]: address[];
        };
        contractCreator: address;
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
