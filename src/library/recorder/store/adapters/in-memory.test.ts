import {ResponseRecorderInMemoryAdapter} from "./in-memory";

const context = describe;

describe("ResponseRecorderInMemoryAdapter", () => {
    let adapter;
    const config = {};

    const keys = {
        none: undefined,
        empty: "",
        nonMatching: "xxxx",
        matching: "abc"
    };

    describe("constructor", () => {
        beforeEach(() => {
            adapter = new ResponseRecorderInMemoryAdapter(config);
            adapter.setItem(keys.matching, "hit");
        });

        it("should create an instance", () => {
            expect(adapter).toBeDefined();
        });

        describe("getItem", () => {
            context("no key", () => {
                it("should not get an item", async () => {
                    try {
                        await adapter.getItem();
                    } catch (e) {
                        expect(e).toBeDefined();
                    }
                });
            });
            context("undefined key", () => {
                it("should not get an item", async () => {
                    try {
                        await adapter.getItem(keys.none);
                    } catch (e) {
                        expect(e).toBeDefined();
                    }
                });
            });

            context("empty key", () => {
                it("should not get an item", async () => {
                    try {
                        await adapter.getItem(keys.empty);
                    } catch (e) {
                        expect(e).toBeDefined();
                    }
                });
            });

            context("non-matching key", () => {
                it("should not get an item", async () => {
                    try {
                        await adapter.getItem(keys.nonMatching);
                    } catch (e) {
                        expect(e).toBeDefined();
                    }
                });
            });

            context("matching key", () => {
                it("should get an item", async () => {
                    const result = await adapter.getItem(keys.matching);
                    expect(result).toBeTruthy();
                });
            });
        });
    });
});
