import {RedirectHandler, RequestContext, RequestParams, HandlerResponseFn} from "../types";

export const createRequestHandler = (params: RequestParams) => new SmartRequestHandler(params);

export class SmartRequestHandler {
    context: RequestContext;
    ctx: any;
    store: any;
    log: any;
    isPublicAccessible: boolean;
    redirectHandler: RedirectHandler;
    handleResponse: HandlerResponseFn;

    constructor(params: RequestParams) {
        const {context, isPublicAccessible, redirectHandler, handleResponse} = params;
        this.context = context;
        const {store, log, data, dataLabel, sessionCtx, apiType, reqMethod} = context;
        const ctx = {dataLabel, data, sessionCtx, apiType, reqMethod};
        this.ctx = ctx;
        this.log = log;
        this.store = store;
        this.isPublicAccessible = isPublicAccessible;
        this.redirectHandler = redirectHandler;
        this.handleResponse = handleResponse;
    }

    retrieveMock = () => {
        const {ctx, redirectHandler, isPublicAccessible, handleResponse} = this;
        const {log} = this.context;
        const {retrieve} = this.store;
        if (!retrieve) return;
        // TODO: use StoreManager with StoreRetriever
        const response = retrieve(ctx);
        if (response) {
            return handleResponse({response, redirectHandler, isPublicAccessible});
        }
        log(ctx, "no recording found for mock response");
    };

    // store mock response and return it
    storeMockResponse = () => {
        const {store, ctx, handleResponse, redirectHandler, isPublicAccessible} = this;
        // const { log } = this.context;
        const {record, mock} = store;
        if (!mock.response) return;
        // TODO: use StoreManager with StoreRecorder
        record && record.response(ctx, mock.response);
        const response = mock.response;
        return handleResponse({response, redirectHandler, isPublicAccessible});
    };

    // store mock error response and throw it
    storeMockError = () => {
        // context
        const {store, ctx, mockError} = this;
        // const {log} = context;
        const {record, mock} = store;
        if (!mock.error) return;
        // TODO: use StoreManager with StoreRecorder
        record && record.error(ctx, mock.error);
        mockError(mock.error);
    };

    mockError = (error) => {
        throw error;
    };

    handle = () => {
        const {retrieveMock, storeMockResponse} = this;
        const {mode} = this.context;
        if (mode !== "mock") return;
        // lookup mock response from recorded responses or store mock and respond
        // TODO: use StoreManager with StoreRetriever
        const response = retrieveMock() || storeMockResponse();
        if (response) return response;
    };
}
