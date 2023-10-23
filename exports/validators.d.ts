import Roles from '@leofcoin/standards/roles.js';
export default class Validators extends Roles {
    #private;
    get state(): {
        minimumBalance: BigNumberish;
        currency: string;
        totalValidators: number;
        activeValidators: number;
        validators: {};
    };
    constructor(tokenAddress: address, state: any);
    get name(): string;
    get currency(): string;
    get validators(): {};
    get totalValidators(): number;
    get minimumBalance(): BigNumberish;
    changeCurrency(currency: any): void;
    has(validator: any): boolean;
    addValidator(validator: address): Promise<void>;
    removeValidator(validator: any): void;
    updateValidator(validator: any, active: any): Promise<void>;
}
