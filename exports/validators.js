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

class Validators extends Roles {
    /**
     * string
     */
    #name = 'ArtOnlineValidators';
    /**
     * uint
     */
    #totalValidators = 0;
    #activeValidators = 0;
    /**
     * Object => string(address) => Object
     */
    #validators = {};
    #currency;
    #minimumBalance;
    get state() {
        return {
            ...super.state,
            minimumBalance: this.#minimumBalance,
            currency: this.#currency,
            totalValidators: this.#totalValidators,
            activeValidators: this.#activeValidators,
            validators: this.#validators
        };
    }
    constructor(tokenAddress, state) {
        super(state?.roles);
        if (state) {
            this.#minimumBalance = state.minimumBalance;
            this.#currency = state.currency;
            this.#totalValidators = state.totalValidators;
            this.#activeValidators = state.activeValidators;
            this.#validators = state.validators;
        }
        else {
            this.#minimumBalance = 50000;
            this.#currency = tokenAddress;
            this.#totalValidators += 1;
            this.#activeValidators += 1;
            this.#validators[msg.sender] = {
                firstSeen: Date.now(),
                lastSeen: Date.now(),
                active: true
            };
        }
    }
    get name() {
        return this.#name;
    }
    get currency() {
        return this.#currency;
    }
    get validators() {
        return { ...this.#validators };
    }
    get totalValidators() {
        return this.#totalValidators;
    }
    get minimumBalance() {
        return this.#minimumBalance;
    }
    changeCurrency(currency) {
        if (!this.hasRole(msg.sender, 'OWNER'))
            throw new Error('not an owner');
        this.#currency = currency;
    }
    has(validator) {
        return Boolean(this.#validators[validator] !== undefined);
    }
    #isAllowed(address) {
        if (msg.sender !== address && !this.hasRole(msg.sender, 'OWNER'))
            throw new Error('sender is not the validator or owner');
        return true;
    }
    async addValidator(validator) {
        this.#isAllowed(validator);
        if (this.has(validator))
            throw new Error('already a validator');
        const balance = await msg.staticCall(this.currency, 'balanceOf', [validator]);
        if (balance < this.minimumBalance)
            throw new Error(`balance to low! got: ${balance} need: ${this.#minimumBalance}`);
        this.#totalValidators += 1;
        this.#activeValidators += 1;
        this.#validators[validator] = {
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            active: true
        };
    }
    removeValidator(validator) {
        this.#isAllowed(validator);
        if (!this.has(validator))
            throw new Error('validator not found');
        this.#totalValidators -= 1;
        if (this.#validators[validator].active)
            this.#activeValidators -= 1;
        delete this.#validators[validator];
    }
    async updateValidator(validator, active) {
        this.#isAllowed(validator);
        if (!this.has(validator))
            throw new Error('validator not found');
        const balance = await msg.staticCall(this.currency, 'balanceOf', [validator]);
        if (balance < this.minimumBalance && active)
            throw new Error(`balance to low! got: ${balance} need: ${this.#minimumBalance}`);
        if (this.#validators[validator].active === active)
            throw new Error(`already ${active ? 'activated' : 'deactivated'}`);
        if (active)
            this.#activeValidators += 1;
        else
            this.#activeValidators -= 1;
        /** minimum balance always needs to be met */
        this.#validators[validator].active = active;
    }
}

export { Validators as default };
