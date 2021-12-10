/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import {getErrorMessage} from "./error-messages";

const unknownErrorMsg = getErrorMessage("unknown");
const networkErrorMsg = getErrorMessage("network");

export class APIError {
    title = unknownErrorMsg.title;
    message = unknownErrorMsg.message;
}

export class NetworkError extends APIError {
    title = networkErrorMsg.title;
    message = networkErrorMsg.message;
}
export class BadResponseError extends APIError {
    error: any;

    constructor(error: any) {
        super();
        this.error = error;
    }
}

export class RequestError extends APIError {
    url: string;
    status: number;
    statusText: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response?: any | any[];

    constructor(
        url: string,
        status: number,
        statusText: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseBody: any | any[]
    ) {
        super();
        this.url = url;
        this.status = status;
        this.statusText = statusText;
        this.response = responseBody;
        const errorMsg = getErrorMessage(status);
        this.title = errorMsg.title;
        this.message = errorMsg.message;
    }
}

export class EmailSendingError extends APIError {}

export type AnyApiError = NetworkError | BadResponseError | EmailSendingError | RequestError;
