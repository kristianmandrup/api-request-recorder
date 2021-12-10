import {GenericStorageAdapter} from "../recorder/store";
export type Recorder = {
    error?: (context, e) => void;
    response?: (context, response) => void;
};

export type Retriever = (context: RequestContext) => string;

export type Mocker = {
    error?: string;
    response?: string;
};

export type ShouldRetry = ({response: string, params: RequestParams}) => boolean;
export type RetryParams = {
    shouldRetry: ShouldRetry;
    retryCtx: any;
    params: RequestParams;
    response?: string;
};

type MakeRetriesResponse = Promise<{retryResponse: any; retriesMade: number}>;

export type RetryManager = {
    makeRetries: ({retryManager, response, params, resp}) => MakeRetriesResponse;
    shouldRetry: ShouldRetry;
    retry: <T = any>(ctx: any) => Promise<T>; // manages execution of retries
    retryCtx: any; // such as number of retries, type of retry algo, time info etc.
};

export type ResponseStorage = {
    storage: GenericStorageAdapter; // adapter to backend
    mock: Mocker;
    record: Recorder;
    retrieve: Retriever;

    // ...
};

export type RequestContext = {
    mode?: string;
    log?: (context: any, ...args: any[]) => void;
    store?: ResponseStorage;
    apiType?: string;
    data?: any;
    dataLabel?: string;
    sessionCtx?: any;
    actionWindow?: number;
    reqMethod?: string;
    retryManager?: RetryManager;
    apiId?: string;
    request?: Promise<HandlerResponse>;
};

export type RedirectHandler = (url?: string) => void;

export type HandlerResponseFn = <T = any>(resp: HandlerResponse) => Promise<T>;

export type HandlerResponse = {
    response: any;
    redirectHandler?: RedirectHandler;
    isPublicAccessible?: boolean;
};

export type RequestParams = {
    request: Promise<any>;
    context: RequestContext;
    redirectHandler?: RedirectHandler;
    isPublicAccessible?: boolean;
    handleResponse?: HandlerResponseFn;
};
