import {GenericStorageAdapter} from "../..";

export class StoreRecorder {
    store: GenericStorageAdapter;
    options: any;

    constructor(store, options = {}) {
        this.store = store;
        this.options = options;
    }
}
