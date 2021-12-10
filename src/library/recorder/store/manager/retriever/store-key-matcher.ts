import {BaseStoreContext} from "../store-context";

export type KeyMatcher = (key: string) => boolean;

export class StoreKeyMatcher extends BaseStoreContext {
    constructor(ctx) {
        super(ctx);
    }

    success = (key: string) => {
        const {successResponseKey} = this.ctx;
        return key === successResponseKey;
    };

    error = (key: string) => {
        const {errorResponseKey} = this.ctx;
        return key === errorResponseKey;
    };

    session = (key: string) => {
        const {sessionKey} = this.ctx;
        return key === sessionKey;
    };

    data = (key: string) => {
        const {dataLabel, dataHash} = this.ctx;
        const [label, hash] = key.split(":");
        return label === dataLabel || hash === dataHash;
    };
}
