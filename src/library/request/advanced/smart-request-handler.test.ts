import {createRequestHandler} from "./smart-request-handler";

// const context = describe;

const redirectHandler = () => {};
const handleResponse = (params: any) => {
    // const {response, redirectHandler, isPublicAccessible} = params;
    return params.response;
};

describe("createRequestHandler", () => {
    describe("constructor", () => {
        const mockResponse = {};
        const doRequest = async () => {
            return mockResponse;
        };

        const params = {
            request: doRequest(),
            context: {},
            isPublicAccessible: true,
            redirectHandler,
            handleResponse
        };

        let requestHandler;

        beforeEach(() => {
            requestHandler = createRequestHandler(params);
        });
        it("creates request handler", async () => {
            expect(requestHandler).toBeDefined();
        });
    });

    describe("mockMode", () => {
        const mockResponse = {};
        const doRequest = async () => {
            return mockResponse;
        };

        let context: any;
        const params = {
            request: doRequest(),
            context,
            isPublicAccessible: true,
            redirectHandler,
            handleResponse
        };

        let requestHandler;

        describe("in mock mode", async () => {
            beforeEach(() => {
                params.context.mode = "mock";
                requestHandler = createRequestHandler(params);
            });
            it("returns mock", async () => {
                expect(requestHandler.mockMode()).toBeDefined();
            });
        });

        describe("NOT in mock mode", async () => {
            beforeEach(() => {
                params.context.mode = "cache";
                requestHandler = createRequestHandler(params);
            });

            it("returns nothing", async () => {
                expect(requestHandler.mockMode()).not.toBeDefined();
            });
        });
    });

    describe("storeMockError", () => {
        const mockResponse = {
            status: 500,
            body: {}
        };
        const doRequest = async () => {
            return mockResponse;
        };

        const params = {
            request: doRequest(),
            context: {},
            isPublicAccessible: true,
            redirectHandler,
            handleResponse
        };

        let requestHandler;

        beforeEach(() => {
            requestHandler = createRequestHandler(params);
        });

        it("stores and returns cached mock error response", () => {
            const response = requestHandler.storeMockError();
            expect(response).toEqual(mockResponse);
            const storedResponse = requestHandler.store.lastStored;
            expect(storedResponse).toEqual(mockResponse);
        });
    });

    describe("storeMockResponse", () => {
        const mockResponse = {
            status: 200,
            body: {}
        };
        const doRequest = async () => {
            return mockResponse;
        };

        const params = {
            request: doRequest(),
            context: {},
            isPublicAccessible: true,
            redirectHandler,
            handleResponse
        };

        let requestHandler;

        beforeEach(() => {
            requestHandler = createRequestHandler(params);
        });
        it("stores and returns cached mock response", () => {
            const response = requestHandler.storeMockResponse();
            expect(response).toEqual(mockResponse);
            const storedResponse = requestHandler.store.lastStored;
            expect(storedResponse).toEqual(mockResponse);
        });
    });

    describe("retrieveMock", () => {
        const mockResponse = {
            status: 200,
            body: {}
        };
        const doRequest = async () => {
            return mockResponse;
        };

        const params = {
            request: doRequest(),
            context: {},
            isPublicAccessible: true,
            redirectHandler,
            handleResponse
        };

        let requestHandler;

        beforeEach(() => {
            requestHandler = createRequestHandler(params);
        });

        it("retrieves cached mock response", () => {
            const response = requestHandler.retrieveMock();
            expect(response).toBeDefined();
        });
    });
});
