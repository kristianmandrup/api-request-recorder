import {makeRetries} from "./make-retries";

const context = describe;

describe("makeRetries", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const retry = async (_: any) => {
        // const {shouldRetry, retryCtx, response: resp, params} = params
        return {};
    };

    context("should not retry", () => {
        it.skip("make retries", async () => {
            const retryManager = {
                shouldRetry: () => false,
                retry,
                retryCtx: {}
            };
            const response = {};
            const params = {};
            const resp = {};

            const {retryResponse, retriesMade} = await makeRetries({
                retryManager,
                response,
                params,
                resp
            });
            expect(retryResponse).toBe(true);
            expect(retriesMade).toBe(true);
        });
    });

    context("should retry", () => {
        it.skip("make retries", async () => {
            const retryManager = {
                shouldRetry: () => true,
                retry,
                retryCtx: {}
            };
            const response = {};
            const params = {};
            const resp = {};

            const {retryResponse, retriesMade} = await makeRetries({
                retryManager,
                response,
                params,
                resp
            });
            expect(retryResponse).toBe(true);
            expect(retriesMade).toBe(true);
        });
    });
});
