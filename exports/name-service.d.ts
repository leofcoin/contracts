type registry = {
    name: {
        address: address;
        owner: address;
    };
};
export default class NameService {
    #private;
    get name(): string;
    get registry(): {};
    get state(): {
        owner: string;
        registry: registry;
        currency: string;
        price: BigNumberish;
    };
    constructor(factoryAddress: address, currency: address, validatorAddress: address, price: BigNumberish, state: {
        owner: address;
        registry: registry;
        currency: address;
        price: BigNumberish;
    });
    changeOwner(owner: any): void;
    changePrice(price: number): void;
    changeCurrency(currency: any): void;
    purchaseName(name: string | number, address: any): Promise<void>;
    lookup(name: string | number): any;
    transferOwnership(name: string | number, to: any): void;
    changeAddress(name: string | number, address: any): void;
}
export {};
