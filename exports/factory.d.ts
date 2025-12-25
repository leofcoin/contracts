import { TokenReceiver } from '@leofcoin/standards';
import { TokenReceiverState } from '@leofcoin/standards/token-receiver.js';
export interface FactoryState extends TokenReceiverState {
    contracts: any[];
    totalContracts: bigint;
}
export default class Factory extends TokenReceiver {
    #private;
    constructor(tokenToReceive: address, tokenAmountToReceive: bigint, state: FactoryState);
    get state(): FactoryState;
    get name(): string;
    get contracts(): string[];
    get totalContracts(): bigint;
    isRegistered(address: any): boolean;
    /**
     * Public hook for creator check to ease testing/stubbing.
     */
    isCreator(address: address): boolean;
    /**
     *
     * @param {Address} address contract address to register
     */
    registerContract(address: string): Promise<void>;
}
