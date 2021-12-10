import {NetworkError} from "../error";
import {defaults} from "./defaults";

export const timeMs = () => new Date().getTime();

// perform request on real backend
export const handleBackendRequest = async ({
    request,
    response,
    store,
    params,
    ctx,
    retryManager,
    redirectHandler,
    isPublicAccessible
}): Promise<any> => {
    const startTime = timeMs();
    const {record} = store;
    const makeRetries = retryManager.makeRetries || defaults.makeRetries;
    const handleResponse = params.handleResponse || defaults.handleResponse;
    return request
        .catch((e) => {
            record.error && record.error(ctx, e);
            throw new NetworkError();
        })
        .then(async (resp) => {
            const {retryResponse, retriesMade} = await makeRetries({
                retryManager,
                response,
                params,
                resp
            });
            const timeElapsed = timeMs() - startTime;
            // record response received
            record.response &&
                record.response(ctx, {
                    response: retryResponse || resp,
                    retries: retriesMade || 0,
                    time: timeElapsed
                });
            // handle response
            handleResponse({response, redirectHandler, isPublicAccessible});
        });
};
