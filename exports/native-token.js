class Roles {
    /**
     * Object => Array
     */
    #roles = {
        'OWNER': [],
        'MINT': [],
        'BURN': []
    };
    constructor(roles) {
        // allow devs to set their own roles but always keep the default ones included
        // also allows roles to be loaded from the stateStore
        // carefull when including the roles make sure to add the owner
        // because no roles are granted by default when using custom roles
        if (roles) {
            if (roles instanceof Object) {
                this.#roles = { ...roles, ...this.#roles };
            }
            else {
                throw new TypeError(`expected roles to be an object`);
            }
        }
        else {
            // no roles given so fallback to default to the msg sender
            this.#grantRole(msg.sender, 'OWNER');
        }
    }
    /**
     *
     */
    get state() {
        return { roles: this.roles };
    }
    get roles() {
        return { ...this.#roles };
    }
    /**
     * @param {address} address
     * @param {string} role
     * @returns true | false
     */
    hasRole(address, role) {
        return this.#roles[role] ? this.#roles[role].includes(address) : false;
    }
    /**
     * @private
     * @param {address} address address to grant the role to
     * @param {string} role role to give
     */
    #grantRole(address, role) {
        if (this.hasRole(address, role))
            throw new Error(`${role} role already granted for ${address}`);
        this.#roles[role].push(address);
    }
    /**
     * remove role for address
     * @private
     * @param {address} address address to revoke role from
     * @param {string} role role to evoke
     */
    #revokeRole(address, role) {
        if (!this.hasRole(address, role))
            throw new Error(`${role} role already revoked for ${address}`);
        if (role === 'OWNER' && this.#roles[role].length === 1)
            throw new Error(`atleast one owner is needed!`);
        this.#roles[role].splice(this.#roles[role].indexOf(address));
    }
    grantRole(address, role) {
        if (!this.hasRole(address, 'OWNER'))
            throw new Error('Not allowed');
        this.#grantRole(address, role);
    }
    revokeRole(address, role) {
        if (!this.hasRole(address, 'OWNER'))
            throw new Error('Not allowed');
        this.#revokeRole(address, role);
    }
}

class Token extends Roles {
    /**
     * string
     */
    #name;
    /**
     * String
     */
    #symbol;
    /**
     * uint
     */
    #holders = 0;
    /**
     * Object => Object => uint
     */
    #balances = {};
    /**
     * Object => Object => uint
     */
    #approvals = {};
    #decimals = 18;
    #totalSupply = BigNumber.from(0);
    // this.#privateField2 = 1
    constructor(name, symbol, decimals = 18, state) {
        if (!name)
            throw new Error(`name undefined`);
        if (!symbol)
            throw new Error(`symbol undefined`);
        super(state?.roles);
        this.#name = name;
        this.#symbol = symbol;
        this.#decimals = decimals;
    }
    // enables snapshotting
    // needs dev attention so nothing breaks after snapshot happens
    // iow everything that is not static needs to be included in the stateObject
    /**
     * @return {Object} {holders, balances, ...}
     */
    get state() {
        return {
            ...super.state,
            holders: this.holders,
            balances: this.balances,
            approvals: { ...this.#approvals },
            totalSupply: this.totalSupply
        };
    }
    get totalSupply() {
        return this.#totalSupply;
    }
    get name() {
        return this.#name;
    }
    get symbol() {
        return this.#symbol;
    }
    get holders() {
        return this.#holders;
    }
    get balances() {
        return { ...this.#balances };
    }
    mint(to, amount) {
        if (!this.hasRole(msg.sender, 'MINT'))
            throw new Error('not allowed');
        this.#totalSupply = this.#totalSupply.add(amount);
        this.#increaseBalance(to, amount);
    }
    burn(from, amount) {
        if (!this.hasRole(msg.sender, 'BURN'))
            throw new Error('not allowed');
        this.#totalSupply = this.#totalSupply.sub(amount);
        this.#decreaseBalance(from, amount);
    }
    #beforeTransfer(from, to, amount) {
        if (!this.#balances[from] || this.#balances[from] < amount)
            throw new Error('amount exceeds balance');
    }
    #updateHolders(address, previousBalance) {
        if (this.#balances[address].toHexString() === '0x00')
            this.#holders -= 1;
        else if (this.#balances[address].toHexString() !== '0x00' && previousBalance.toHexString() === '0x00')
            this.#holders += 1;
    }
    #increaseBalance(address, amount) {
        if (!this.#balances[address])
            this.#balances[address] = BigNumber.from(0);
        const previousBalance = this.#balances[address];
        this.#balances[address] = this.#balances[address].add(amount);
        this.#updateHolders(address, previousBalance);
    }
    #decreaseBalance(address, amount) {
        const previousBalance = this.#balances[address];
        this.#balances[address] = this.#balances[address].sub(amount);
        this.#updateHolders(address, previousBalance);
    }
    balanceOf(address) {
        return this.#balances[address];
    }
    setApproval(operator, amount) {
        const owner = msg.sender;
        if (!this.#approvals[owner])
            this.#approvals[owner] = {};
        this.#approvals[owner][operator] = amount;
    }
    approved(owner, operator, amount) {
        return this.#approvals[owner][operator] === amount;
    }
    transfer(from, to, amount) {
        // TODO: is BigNumber?
        amount = BigNumber.from(amount);
        this.#beforeTransfer(from, to, amount);
        this.#decreaseBalance(from, amount);
        this.#increaseBalance(to, amount);
    }
}

class ArtOnline extends Token {
    constructor(state) {
        super('ArtOnline', 'ART', 18, state);
    }
}

export { ArtOnline as default };
