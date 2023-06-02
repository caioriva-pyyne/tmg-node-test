export class NoKeyValuePairError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, NoKeyValuePairError.prototype);
    }
}
