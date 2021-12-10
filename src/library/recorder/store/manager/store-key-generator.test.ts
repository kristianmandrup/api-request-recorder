import {StoreKeyGenerator} from "./store-key-generator";

const context = describe;

describe("StoreKeyGenerator", () => {
    let generator;
    const ctx = {
        apiType: "vidispine",
        reqMethod: "get",
        apiId: "a.b.c"
    };

    describe("constructor", () => {
        beforeEach(() => {
            generator = new StoreKeyGenerator(ctx);
        });

        it("should create an instance", () => {
            expect(generator).toBeDefined();
        });

        describe("createErrorResponseKey", () => {
            it("should create response key", () => {
                const expected = `error:${ctx.apiType}:${ctx.reqMethod}:${ctx.apiId}`;
                expect(generator.createErrorResponseKey()).toEqual(expected);
            });
        });

        describe("createSuccessResponseKey", () => {
            it("should create response key", () => {
                const expected = `success:${ctx.apiType}:${ctx.reqMethod}:${ctx.apiId}`;
                expect(generator.createSuccessResponseKey()).toEqual(expected);
            });
        });

        describe("createSessionKey", () => {
            context("empty session ctx", () => {
                beforeEach(() => {
                    generator.ctx = {sessionCtx: {}};
                });

                it("should create stringified session key", () => {
                    expect(generator.createSessionKey()).toEqual("{}");
                });
            });

            context("session ctx user first", () => {
                beforeEach(() => {
                    const sessionCtx = {
                        user: "abc@zonza.com",
                        actions: [
                            {type: "CREATE", payload: "asset"},
                            {type: "UPDATE", payload: "asset"}
                        ]
                    };
                    generator.ctx = {sessionCtx};
                });

                it("should create stringified sorted session key", () => {
                    const expected =
                        '{"actions":[{"payload":"asset","type":"CREATE"},{"payload":"asset","type":"UPDATE"}],"user":"abc@zonza.com"}';
                    expect(generator.createSessionKey()).toEqual(expected);
                });
            });

            context("session ctx user last", () => {
                beforeEach(() => {
                    const sessionCtx = {
                        actions: [
                            {type: "CREATE", payload: "asset"},
                            {type: "UPDATE", payload: "asset"}
                        ],
                        user: "abc@zonza.com"
                    };
                    generator.ctx = {sessionCtx};
                });

                it("should create stringified sorted session key", () => {
                    const expected =
                        '{"actions":[{"payload":"asset","type":"CREATE"},{"payload":"asset","type":"UPDATE"}],"user":"abc@zonza.com"}';
                    expect(generator.createSessionKey()).toEqual(expected);
                });
            });
        });

        describe("createDataKey", () => {
            context("empty data and label", () => {
                beforeEach(() => {
                    generator.ctx = {dataLabel: "", data: {}};
                });

                it("should create key with no label but with hash data key for empty object", () => {
                    const expected = ":5d1be7e9dda1ee8896be5b7e34a85ee16452a7b4";
                    expect(generator.createDataKey()).toEqual(expected);
                });
            });

            context("data but no label", () => {
                beforeEach(() => {
                    generator.ctx = {dataLabel: "", data: {abc: 123}};
                });

                it("should create key with no label but with hash data key with ", () => {
                    const expected = ":e8853bdb5670bd93f110ccdd1701f2c3fb5cbbc5";
                    expect(generator.createDataKey()).toEqual(expected);
                });
            });

            context("label but no data", () => {
                beforeEach(() => {
                    generator.ctx = {dataLabel: "alphabet", data: {}};
                });

                it("should create label key with hash data key for empty object", () => {
                    const expected = "alphabet:5d1be7e9dda1ee8896be5b7e34a85ee16452a7b4";
                    expect(generator.createDataKey()).toEqual(expected);
                });
            });

            context("data and label", () => {
                beforeEach(() => {
                    generator.ctx = {dataLabel: "alphabet", data: {abc: 123}};
                });

                it("should create key with with label and hash data key", () => {
                    const expected = "alphabet:e8853bdb5670bd93f110ccdd1701f2c3fb5cbbc5";
                    expect(generator.createDataKey()).toEqual(expected);
                });
            });
        });
    });
});
