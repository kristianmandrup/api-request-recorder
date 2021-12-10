import {StoreResponseValueGenerator} from "./store-response-value-generator";

describe("StoreResponseValueGenerator", () => {
    let generator;
    const ctx = {
        successResponseKey: "success",
        sessionKey: "session",
        dataLabel: "numbers",
        dataHash: "1234"
    };

    const response = {
        status: 200,
        body: "ok"
    };
    const time = 125;

    describe("constructor", () => {
        beforeEach(() => {
            generator = new StoreResponseValueGenerator();
        });

        it("should create an instance", () => {
            expect(generator).toBeDefined();
        });

        describe("createResponseValue", () => {
            it("should create response value retrieved from storage", () => {
                const result = generator.createResponseValue({response, time}, ctx);
                expect(result).toEqual({
                    response,
                    time
                });
            });
        });
    });
});
