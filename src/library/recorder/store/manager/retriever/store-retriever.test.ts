import {InMemoryStorageAdapter} from "../../adapters/in-memory";
import {StoreRetriever} from "./store-retriever";

const context = describe;

describe("StoreRetriever", () => {
    let retriever;

    const successResponseKey = "success";
    const errorResponseKey = "error";
    const sessionKey = "session";
    const dataLabel = "numbers";
    const dataHash = "1234";
    const ctx = {
        errorResponseKey,
        successResponseKey,
        sessionKey,
        dataLabel,
        dataHash
    };
    const apiType = "vidispine";
    const reqMethod = "GET";
    const apiId = "a.b.c";

    const keyGenCtx = {
        apiType,
        reqMethod,
        apiId
    };

    const config = {};
    const store = new InMemoryStorageAdapter(config);

    describe("constructor", () => {
        beforeEach(() => {
            retriever = new StoreRetriever(ctx, store);
        });

        it("should create an instance", () => {
            expect(retriever).toBeDefined();
        });

        it("should have set the store", () => {
            expect(retriever.store).toBe(store);
        });

        describe("createStoreKeyMatcher", () => {
            let keyMatcher;
            beforeEach(() => {
                keyMatcher = retriever.createStoreKeyMatcher(ctx);
            });
            it("should create an instance", () => {
                expect(keyMatcher).toBeDefined();
            });
        });

        describe("createStoreKeyGenerator", () => {
            let keyGen;
            beforeEach(() => {
                keyGen = retriever.createStoreKeyGenerator(keyGenCtx);
            });
            it("should create an instance", () => {
                expect(keyGen).toBeDefined();
            });
        });

        describe("populateCtxForMatch", () => {
            let popCtx, keyGenerator;
            beforeAll(() => {
                retriever = new StoreRetriever(keyGenCtx, store);
                retriever.reconfigure();
                popCtx = retriever.ctx;
                keyGenerator = retriever.keyGenerator;
            });

            it("populate ctx", () => {
                expect(popCtx).toBeTruthy();
            });

            it("has successResponseKey", () => {
                expect(popCtx.successResponseKey).toEqual(keyGenerator.createSuccessResponseKey());
            });

            it("has errorResponseKey", () => {
                expect(popCtx.errorResponseKey).toEqual(keyGenerator.createErrorResponseKey());
            });

            it("has sessionKey", () => {
                expect(popCtx.sessionKey).toEqual(keyGenerator.createSessionKey());
            });

            it("has dataKey", () => {
                expect(popCtx.dataKey).toEqual(keyGenerator.createDataKey());
            });
        });

        describe("lookupResponseKey", () => {
            beforeEach(() => {
                retriever = new StoreRetriever(ctx, store);
            });

            it("should return the successResponseKey", () => {});
        });

        describe("lookupKey", () => {
            context("success key not matching", () => {
                beforeEach(() => {
                    retriever = new StoreRetriever(ctx, store);
                });

                it("should return error", async () => {
                    const key = "bad key";
                    const type = "session";
                    const result = await retriever.lookupKey(store, type, key);
                    const expected = {
                        success: false,
                        error: `No matching ${type} item found for key: success`
                    };
                    expect(result.success).toBeFalsy();
                    expect(result.error).toEqual(expected.error);
                });
            });

            context("success key matching", () => {
                beforeEach(() => {
                    retriever = new StoreRetriever(ctx, store);
                });

                it("should return hit", async () => {
                    const key = "success";
                    const type = "session";
                    const result = await retriever.lookupKey(store, type, key);
                    expect(result.success).toBeTruthy();
                });
            });
        });

        describe("matchSuccess", () => {
            beforeEach(() => {
                retriever = new StoreRetriever(ctx, store);
            });

            context("success key not matching", () => {
                const storeObj = {};

                beforeEach(() => {
                    const $store = new InMemoryStorageAdapter(config).setStore(storeObj);
                    retriever.configure({
                        ctx: {...ctx, sessionKey: "session2"},
                        store: $store
                    });
                });

                it("should return error", async () => {
                    const expected = {
                        success: false,
                        error: `No matching item found for key: success`
                    };
                    const result = await retriever.matchSuccess();
                    expect(result.success).toBeFalsy();
                    expect(result.error).toEqual(expected.error);
                });
            });

            context("session key not matching", () => {
                const storeObj = {
                    success: {}
                };

                beforeEach(() => {
                    retriever = new StoreRetriever(ctx, store);
                    const $store = new InMemoryStorageAdapter(config).setStore(storeObj);
                    retriever.configure({
                        ctx: {...ctx, sessionKey: "session2"},
                        store: $store
                    });
                });

                it("should have the store set", async () => {
                    expect(retriever.storage.store).toEqual(storeObj);
                });

                it("should return error", async () => {
                    const expected = {
                        success: false,
                        error: `No matching session item found for key: session2`
                    };
                    const result = await retriever.matchSuccess();
                    expect(result.success).toBeFalsy();
                    expect(result.error).toEqual(expected.error);
                });
            });

            context.skip("data store matching", () => {
                context.skip("data key not matching", () => {
                    const dataStore = {};
                    const storeObj = {
                        success: {
                            session: dataStore
                        }
                    };

                    beforeEach(() => {
                        const $store = new InMemoryStorageAdapter(config).setStore(storeObj);
                        retriever.configure({
                            store: $store
                        });
                    });

                    it("should have the store set", async () => {
                        expect(retriever.storage.store).toEqual(storeObj);
                    });

                    it("should return error", async () => {
                        const expected = {
                            success: false,
                            error: `No matching data item found for key: numbers:1234`
                        };
                        const result = await retriever.matchSuccess();
                        expect(result.success).toBeFalsy();
                        expect(result.error).toEqual(expected.error);
                    });
                });
            });

            context.skip("all keys match", () => {
                const storeObj = {
                    success: {
                        session: {
                            data: {}
                        }
                    }
                };

                beforeEach(() => {
                    const $store = new InMemoryStorageAdapter(config).setStore(storeObj);
                    retriever.configure({
                        store: $store
                    });
                });
                it("should have the store set", async () => {
                    expect(retriever.storage.store).toEqual(storeObj);
                });

                it("should succeed", () => {
                    expect(retriever.matchSuccess()).toBeTruthy();
                });
            });
        });
    });
});
