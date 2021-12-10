import {GenericStorageAdapter} from "./generic";

export const createInMemoryStorageAdapter = (config: any, store?: any): InMemoryStorageAdapter => {
    return new InMemoryStorageAdapter(config).setStore(store);
};

export class InMemoryStorageAdapter extends GenericStorageAdapter {
    config: any;
    store: any = {};

    constructor(config: any) {
        super(config);
    }

    setStore(store: any): InMemoryStorageAdapter {
        this.store = store;
        return this;
    }

    async getItem(key: string): Promise<any> {
        if (this.badKey(key)) {
            throw new Error(`Invalid key: ${key}`);
        }
        return this.store[key];
    }

    async setItem(key: string, value: any): Promise<any> {
        this.store[key] = value;
        this.config.lastStoredKey = key;
        return value;
    }
}
