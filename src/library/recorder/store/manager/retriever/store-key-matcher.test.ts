import {StoreKeyMatcher} from "./store-key-matcher";

describe("StoreKeyMatcher", () => {
    let matcher;
    const ctx = {
        successResponseKey: "success",
        errorResponseKey: "error",
        sessionKey: "session",
        dataLabel: "numbers",
        dataHash: "1234"
    };

    describe("constructor", () => {
        beforeEach(() => {
            matcher = new StoreKeyMatcher(ctx);
        });

        it("should create an instance", () => {
            expect(matcher).toBeDefined();
        });

        describe("matchSuccessResponseKey", () => {
            const keys = {
                matching: "success",
                notMatching: "xxxx"
            };

            it("matches correct success key", () => {
                const result = matcher.success(keys.matching);
                expect(result).toBe(true);
            });

            it("does NOT match with bad key", () => {
                const result = matcher.success(keys.notMatching);
                expect(result).toBe(false);
            });
        });

        describe("matchErrorResponseKey", () => {
            const keys = {
                matching: "error",
                notMatching: "xxxx"
            };

            it("matches correct error key", () => {
                const result = matcher.error(keys.matching);
                expect(result).toBe(true);
            });

            it("does NOT match with bad key", () => {
                const result = matcher.error(keys.notMatching);
                expect(result).toBe(false);
            });
        });

        describe("matchSessionKey", () => {
            const keys = {
                matching: "session",
                notMatching: "xxxx"
            };

            it("matches correct session key", () => {
                const result = matcher.session(keys.matching);
                expect(result).toBe(true);
            });

            it("does NOT match with bad key", () => {
                const result = matcher.session(keys.notMatching);
                expect(result).toBe(false);
            });
        });

        describe("matchDataKey", () => {
            const keys = {
                matching: "numbers:1234",
                notMatching: "xxxx"
            };

            it("matches correct data key", () => {
                const result = matcher.data(keys.matching);
                expect(result).toBe(true);
            });

            it("does NOT match with bad key", () => {
                const result = matcher.data(keys.notMatching);
                expect(result).toBe(false);
            });
        });
    });
});
