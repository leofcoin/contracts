export default class Factory {
    #private;
    constructor(state: {
        contracts: any[];
        totalContracts: number;
    });
    get state(): {
        totalContracts: number;
        contracts: any[];
    };
    get name(): string;
    get contracts(): any[];
    get totalContracts(): number;
    isRegistered(address: any): boolean;
    /**
     *
     * @param {Address} address contract address to register
     */
    registerContract(address: string): Promise<void>;
}
