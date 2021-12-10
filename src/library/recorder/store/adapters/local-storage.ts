import {ResponseRecorderStorageAdapter} from "./generic";

export class LocalStorageAdapter extends ResponseRecorderStorageAdapter {
    storage: any;

    constructor(config) {
        super(config);
    }

    configure() {
        this.storage = window.localStorage;
    }

    async getItem(key: string) {
        return this.storage.getItem(key);
    }

    async setItem(key: string, value: any) {
        const result = this.storage.setItem(key, value);
        this.config.lastStoredKey = key;
        return result;
    }
}
