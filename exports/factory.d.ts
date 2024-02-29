import { TokenReceiver } from '@leofcoin/standards';
import type { PublicVotingState } from '@leofcoin/standards/public-voting';
import { TokenReceiverState } from '@leofcoin/standards/token-receiver';
export interface FactoryState extends TokenReceiverState {
    contracts: any[];
    totalContracts: typeof BigNumber;
}
export default class Factory extends TokenReceiver {
    #private;
    constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, state: FactoryState);
    get state(): PublicVotingState;
    get name(): string;
    get contracts(): any[];
    get totalContracts(): any;
    isRegistered(address: any): boolean;
    /**
     *
     * @param {Address} address contract address to register
     */
    registerContract(address: string): Promise<void>;
}
