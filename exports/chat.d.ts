import { TokenReceiver } from '@leofcoin/standards';
import { TokenReceiverState } from '@leofcoin/standards/token-receiver';
export interface chatState extends TokenReceiverState {
    nicknames: {
        [address: string]: string;
    };
}
export default class Chat extends TokenReceiver {
    #private;
    constructor(tokenToReceive: any, tokenAmountToReceive: any, state: any);
    changeNickName(newName: string): Promise<void>;
}
