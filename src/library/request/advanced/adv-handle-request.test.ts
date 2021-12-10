import {advHandleRequest} from "./adv-handle-request";

const context = describe;

const handleResponse = (params: any) => {
    // const {response, redirectHandler, isPublicAccessible} = params;
    return params.response;
};

describe("advHandleRequest", () => {
    const doRequest = async () => {
        return {};
    };

    context.skip("publicly accessible", () => {
        it.skip("handles rwequest", async () => {
            // const params = {
            //     request: doRequest(),
            //     context: {},
            //     isPublicAccessible: true,
            //     handleResponse
            // };
            // const {retryResponse, retriesMade} = await advHandleRequest(params);
        });
    });

    context.skip("not publicly accessible", () => {});

    context.skip("no context passed", () => {
        // store, actionWindow, log, data, dataLabel, apiType, reqMethod, retryManager
        context.skip("store is passed", () => {});

        context.skip("log is passed", () => {});

        context.skip("data is passed", () => {});

        context.skip("apiType is passed", () => {});

        context.skip("reqMethod is passed", () => {});

        context.skip("retryManager is passed", () => {
            context.skip("retry function is not passed", () => {});

            context.skip("retry function is passed", () => {});

            context.skip("retryCtx is passed", () => {});

            context.skip("shouldRetry function is not passed", () => {});

            context.skip("shouldRetry function is passed", () => {
                context.skip("shouldRetry returns true", () => {
                    context.skip("retry function is not passed", () => {});

                    context.skip("retry function is passed", () => {});
                });

                context.skip("shouldRetry returns false", () => {});
            });

            context.skip("makeRetries function is passed", () => {});
        });

        context.skip("dataLabel is passed", () => {});
    });

    context("redirectHandler is not provided", () => {
        it("handles request", async () => {
            const params = {
                request: doRequest(),
                context: {},
                isPublicAccessible: true,
                handleResponse
            };

            const {retryResponse, retriesMade} = await advHandleRequest(params);
            expect(retryResponse).toBe(true);
            expect(retriesMade).toBe(0);
        });
    });

    context("redirectHandler is provided", () => {
        const redirectHandler = () => {
            // todo
        };

        it("handles request", async () => {
            const params = {
                request: doRequest(),
                context: {},
                isPublicAccessible: true,
                redirectHandler,
                handleResponse
            };

            const {retryResponse, retriesMade} = await advHandleRequest(params);
            expect(retryResponse).toBe(true);
            expect(retriesMade).toBe(true);
        });
    });
});
