import {RequestParams} from "../types";

import {handleBackendRequest} from "./handle-backend-request";
import {createRequestHandler} from "./smart-request-handler";

(globalThis.window as any).sessionActionStack = (globalThis.window as any).sessionActionStack || {};

export const advHandleRequest = <T = any>(params: RequestParams): Promise<T> => {
    const {request, context, isPublicAccessible, redirectHandler} = params;
    const {store, actionWindow, log, data, dataLabel, apiType, reqMethod, retryManager} = context;

    const latestActions = (globalThis.window as any).sessionActionStack.getWindow(actionWindow);
    const sessionCtx = context.sessionCtx || latestActions;
    const ctx = {dataLabel, data, sessionCtx, apiType, reqMethod};

    log && log(ctx);
    const smartRequestHandler = createRequestHandler(params);
    const response = smartRequestHandler.handle();
    if (response) return response;

    return handleBackendRequest({
        request,
        response,
        store,
        ctx,
        params,
        retryManager,
        redirectHandler,
        isPublicAccessible
    });
};
