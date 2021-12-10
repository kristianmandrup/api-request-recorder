/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import {BadResponseError, AnyApiError, NetworkError, RequestError} from "../error/error";

const TEXT_CONTENT_TYPES = ["text/plain", "application/rdf+xml"];

const HTML_CONTENT_TYPE = "text/html";
export const isRedirected = (response: Response): boolean => {
    if (response.redirected && response.url) {
        return true;
    }

    // response.redirected is not available on IE so additionally we check
    // whether Vidi responds with html, which means login page
    const contentType = response.headers.get("Content-Type");
    const isHtmlContentType = contentType && contentType.includes(HTML_CONTENT_TYPE);
    return !!(isHtmlContentType && response.ok);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleContent = (
    response: Response,
    redirectHandler?: (url?: string) => void,
    isPublicAccessible = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    if (response.status && response.status >= 500) {
        // Promise.resolve, because it'll be later caught as RequestError
        return Promise.resolve(response);
    }
    if (isRedirected(response)) {
        if (redirectHandler) {
            redirectHandler(response.url);
        } else if (response.url) {
            if (!isPublicAccessible) {
                const targetLocation = encodeURIComponent(window.location.href);
                window.location.assign(`${response.url}?redirect=${targetLocation}`);
            }
        } else {
            response.text().then((responseContent) => {
                // Redirection workaround for IE.
                // For more details enjoy reading comments of ZN-3655.
                document.open("text/html", "replace");
                document.write(responseContent);
                document.close();
            });
        }

        // Returning void promise to block further processing of this request during redirection.
        // Otherwise errors would show to the user for a moment.
        return new Promise(() => null);
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType || TEXT_CONTENT_TYPES.includes(contentType)) {
        return response.text();
    }
    return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleResponse = (
    response: Response,
    redirectHandler?: (url?: string) => void,
    isPublicAccessible = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any =>
    handleContent(response, redirectHandler, isPublicAccessible)
        .catch((error: any) => {
            throw new BadResponseError(error);
        })
        .then((content: any) => {
            if (!response.ok) {
                const {url, status, statusText} = response;
                throw new RequestError(url, status, statusText, content);
            }
            return content;
        });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleRequest = <T = any>(
    request: Promise<Response>,
    redirectHandler?: (url?: string) => void,
    isPublicAccessible = false
): Promise<T> =>
    request
        .catch(() => {
            throw new NetworkError();
        })
        .then((response) => handleResponse(response, redirectHandler, isPublicAccessible));

export const logRequestError = (error: AnyApiError, label = "REQUEST") => {
    if (error instanceof RequestError) {
        if (error.status >= 400 && error.status < 500) {
            console.error(`${label}: client error:`, error);
        } else {
            console.error(`${label}: server error:`, error);
        }
    } else if (error instanceof NetworkError) {
        console.error(`${label}: network error:`, error);
    } else {
        console.error(`${label}: unknown error:`, error);
    }
};

// Vidispine returns 400 in case of not-numeric id like 'VX-non-existing'.
// We want to handle this case as 404 - asset not found.
export const handle400As404IfIdNotNumeric = (error: RequestError, id: string): RequestError => {
    if (error.status === 400) {
        const isIdNumeric = id.match(/^VX-\d+$/);
        if (error.status === 400 && !isIdNumeric) {
            const newError = new RequestError(
                error.url,
                404,
                error.statusText,
                error.response || {}
            );

            return newError;
        }
    }

    return error;
};
