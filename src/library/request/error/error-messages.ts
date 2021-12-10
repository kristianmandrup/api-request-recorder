import {EMAIL_SUPPORT} from "../constants";

type ErrorMsg = {
    title: string;
    message: string;
};

const ERROR_MESSAGES: Map<string, ErrorMsg> = new Map(
    Object.entries({
        404: {
            title: "Page not found",
            message:
                "Sorry, the page you are trying to reach cannot be found." +
                " This could be caused by a bad or outdated link."
        },
        403: {
            title: "Permission denied",
            message: "Sorry, you don't have permission to view this page."
        },
        500: {
            title: "Internal server error",
            message:
                "Sorry, your request could not be completed because" +
                " an internal server error occurred." +
                ` Please try again and contact us at ${EMAIL_SUPPORT} if the issue persists.`
        },
        501: {
            title: "501 Not implemented",
            message:
                "Sorry, an unexpected error occurred." +
                ` Please try again and contact us at ${EMAIL_SUPPORT} if the issue persists.`
        },
        502: {
            title: "502 Bad gateway",
            message:
                "Sorry, your request could not be completed because a bad gateway error occurred." +
                ` Please try again and contact us at ${EMAIL_SUPPORT} if the issue persists.`
        },
        503: {
            title: "503 Service unavailable",
            message:
                "Sorry, your request could not be completed because" +
                " the service is currently unavailable." +
                ` Please try again and contact us at ${EMAIL_SUPPORT} if the issue persists.`
        },
        504: {
            title: "504 Gateway timeout",
            message:
                "Sorry, your request could not be completed because" +
                " a gateway timeout error occurred." +
                ` Please try again and contact us at ${EMAIL_SUPPORT} if the issue persists.`
        },
        network: {
            title: "Network not available",
            message: "Please check your connection and try again."
        },
        unknown: {
            title: "Unknown error",
            message:
                "Sorry, an unexpected error occurred." +
                ` Please try again and contact us at ${EMAIL_SUPPORT} if the issue persists.`
        }
    })
);

const ERROR_FALLBACK = "unknown";

export function getErrorMessage(errorLabel: string | number) {
    if (typeof errorLabel !== "string") {
        // eslint-disable-next-line no-param-reassign
        errorLabel = errorLabel.toString();
    }

    if (!ERROR_MESSAGES.has(errorLabel)) {
        // eslint-disable-next-line no-param-reassign
        errorLabel = ERROR_FALLBACK;
    }

    return ERROR_MESSAGES.get(errorLabel) as ErrorMsg;
}
