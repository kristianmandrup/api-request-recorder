import {BadResponseError, RequestError} from "../error/error";
import {handleContent} from "./handle-content";

export const handleResponse = (
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
