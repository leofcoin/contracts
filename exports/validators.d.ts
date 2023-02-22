import Roles from '@leofcoin/standards/roles.js';
export default class Validators extends Roles {
    #private;
    get state(): any;
    constructor(tokenAddress: any, state: any);
    get name(): string;
    get currency(): any;
    get validators(): {};
    get totalValidators(): number;
    get minimumBalance(): any;
    changeCurrency(currency: any): void;
    has(validator: any): boolean;
    addValidator(validator: address): Promise<void>;
    removeValidator(validator: any): void;
    updateValidator(validator: any, active: any): Promise<void>;
}
