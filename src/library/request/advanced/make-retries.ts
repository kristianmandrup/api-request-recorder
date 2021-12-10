export const makeRetries = async ({retryManager, response, params, resp}) => {
    let retryResponse, retriesMade;
    // optionally retry until we get satisfactory response or we give up
    const {shouldRetry, retry, retryCtx} = retryManager || {};
    if (shouldRetry && shouldRetry({response, params})) {
        const retryResults = await retry({
            shouldRetry,
            retryCtx,
            response: resp,
            params
        });
        retryResponse = retryResults.response;
        retriesMade = retryResults.retries;
    }
    return {retryResponse, retriesMade};
};
