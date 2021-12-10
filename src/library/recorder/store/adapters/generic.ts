import {KeyMatcher} from "./../manager";
export interface IStorageAdapter {
    setCtx(ctx);
    badKey(key: string);
    configure(): void;
    getItem(key: string): Promise<any>;
    setItem(key: string, value: any): Promise<any>;
    getStoreOnMatch(key: string, matcher: KeyMatcher): any;
}

export abstract class GenericStorageAdapter implements IStorageAdapter {
    config: any;
    ctx: any;
    store: any = {};

    constructor(config: any) {
        this.config = config;
    }

    getStoreOnMatch(key: string, matcher: KeyMatcher): any {
        if (matcher(key)) return this.store;
    }

    get lastStored() {
        return this.getItem(this.config.lastStoredKey);
    }

    badKey(key: string) {
        return key === null || key === undefined || key.trim() === "";
    }

    setCtx(ctx): IStorageAdapter {
        this.ctx = ctx;
        return this;
    }

    configure(): IStorageAdapter {
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getItem(_: string): Promise<any> {
        throw new Error("getItem must be implement by subclass");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setItem(key: string, value: any): Promise<any> {
        throw new Error("setItem must be implement by subclass");
    }
}
