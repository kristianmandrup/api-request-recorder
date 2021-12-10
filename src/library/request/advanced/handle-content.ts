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
export const handleContent = (
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
