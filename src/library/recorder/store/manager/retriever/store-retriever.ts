import {InMemoryStorageAdapter, IStorageAdapter} from "../../adapters";
import {StoreKeyGenerator} from "../store-key-generator";
import {StoreKeyMatcher} from "./store-key-matcher";
import {BaseStoreContext} from "../store-context";

export class StoreRetriever extends BaseStoreContext {
    store: IStorageAdapter;
    matcher: StoreKeyMatcher;
    keyGenerator: StoreKeyGenerator;

    constructor(ctx, store) {
        super(ctx);
        this.configure({store});
    }

    configure(params: {store?: any; ctx?: any}) {
        const {store, ctx} = params;
        if (ctx) {
            this.ctx = ctx;
        }
        this.matcher = this.createStoreKeyMatcher();
        this.keyGenerator = this.createStoreKeyGenerator();
        this.ctx = this.populateCtxForMatch();
        if (store) {
            this.store = store;
        }
    }

    createStoreKeyMatcher() {
        return new StoreKeyMatcher(this.ctx);
    }

    createStoreKeyGenerator() {
        return new StoreKeyGenerator(this.ctx);
    }

    createInMemoryItemStoreFor(store: any) {
        return new InMemoryStorageAdapter(this.ctx).setStore(store);
    }

    async lookupResponseKey(store: IStorageAdapter, responseKey: string): Promise<any> {
        const matchingSuccessItem = await store.getItem(responseKey);
        console.log({matchingSuccessItem, store: (store as InMemoryStorageAdapter).store});
        if (!matchingSuccessItem) {
            return {
                success: false,
                error: `No matching item found for key: ${responseKey}`,
                store: store
            };
        }
        return {
            success: true,
            store: this.createInMemoryItemStoreFor(matchingSuccessItem)
        };
    }

    errors = {
        generic: (store, type: string, key: string) => ({
            success: false,
            error: `No matching ${type} item found for ${key}`,
            store
        }),
        request: (store, key: string) => this.errors.generic(store, "request", key),
        session: (key, store) => this.errors.generic(key, store, "session"),
        data: (store, key: string) => this.errors.generic(store, "data", key)
    };

    lookupSuccess = (matchingObj) => ({
        success: true,
        store: this.createInMemoryItemStoreFor(matchingObj)
    });

    async lookupKey(store: IStorageAdapter, type: string, key: string): Promise<any> {
        const keyMatcher = this.matcher[type];
        const matchingObj = store.getStoreOnMatch(key, keyMatcher);
        console.log(type, {matchingObj});
        return matchingObj ? this.lookupSuccess(matchingObj) : this.errors[type](store, key);
    }

    async match(type = "success") {
        const {store, ctx} = this;
        const {dataKey, sessionKey, successResponseKey, errorResponseKey} = ctx;
        const responseKeyMap = {
            error: errorResponseKey,
            success: successResponseKey
        };
        const responseKey = responseKeyMap[type];
        if (!store.setCtx) {
            const errMsg = "Invalid store - missing setCtx method";
            console.error(errMsg, store);
            throw new Error(errMsg);
        }
        store.setCtx(ctx);

        // lookup response key
        const responseKeyResult = await this.lookupResponseKey(store, responseKey);
        if (!responseKeyResult.success) return responseKeyResult;

        // lookup session key
        const sessionStore = responseKeyResult.store;
        const sessionKeyResult = await this.lookupKey(sessionStore, "session", sessionKey);
        if (!sessionKeyResult.success) return sessionKeyResult;

        // lookup data key
        const dataStore = sessionKeyResult.store;
        const dataKeyResult = await this.lookupKey(dataStore, "data", dataKey);
        return dataKeyResult;
    }

    async matchError() {
        return await this.match("error");
    }

    async matchSuccess() {
        return await this.match("success");
    }

    populateCtxForMatch = () => {
        const {createSessionKey, createDataKey, createSuccessResponseKey, createErrorResponseKey} =
            this.keyGenerator;
        return {
            successResponseKey: createSuccessResponseKey(),
            errorResponseKey: createErrorResponseKey(),
            dataKey: createDataKey(),
            sessionKey: createSessionKey(),
            ...this.ctx
        };
    };
}
