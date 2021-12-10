import {handleBackendRequest} from "./handle-backend-request";

const context = describe;

const redirectHandler = () => {};

describe("handleBackendRequest", () => {
    const requestFn = () => {
        return new Promise((resolve) => {
            resolve({
                status: 200,
                data: {
                    message: "success"
                }
            });
        });
    };
    const request = requestFn();

    const response = {};
    const store = {};
    const params = {};
    const ctx = {};
    const retryManager = {};

    const isPublicAccessible = true;

    context("no retries", () => {
        it("creates request handler", async () => {
            const args = {
                request,
                response,
                store,
                params,
                ctx,
                retryManager,
                redirectHandler,
                isPublicAccessible
            };
            const result = await handleBackendRequest(args);
            expect(result).toBeDefined();
        });
    });
});
