import { TokenReceiver } from '@leofcoin/standards';
import { TokenReceiverState } from '@leofcoin/standards/token-receiver';
type registry = {
    name?: {
        address: address;
        owner: address;
    };
};
export interface NameServiceState extends TokenReceiverState {
    registry: registry;
}
export default class NameService extends TokenReceiver {
    #private;
    get name(): string;
    get registry(): {};
    get state(): NameServiceState;
    constructor(factoryAddress: address, tokenToReceive: address, validatorAddress: address, tokenAmountToReceive: bigint, state: NameServiceState);
    purchaseName(name: string | number, address: any): Promise<void>;
    lookup(name: string | number): any;
    transferOwnership(name: string | number, to: any): void;
    changeAddress(name: string | number, address: any): void;
}
export {};
