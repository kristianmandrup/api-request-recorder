import stringify from "json-stringify-nice";
import {sha1} from "hash-anything";
import {BaseStoreContext} from "./store-context";

export class StoreKeyGenerator extends BaseStoreContext {
    constructor(ctx) {
        super(ctx);
    }

    createErrorResponseKey = () => {
        const {apiType, reqMethod, apiId} = this.ctx;
        return `error:${apiType}:${reqMethod}:${apiId}`;
    };

    createSuccessResponseKey = () => {
        const {reqMethod, apiId, ctx} = this;
        const {apiType} = ctx;
        return `success:${apiType}:${reqMethod}:${apiId}`;
    };

    createSessionKey = () => {
        const {sessionCtx} = this.ctx;
        return stringify(sessionCtx, null, ""); // no indentation, use optional replacer
    };

    createDataKey = () => {
        const {dataLabel, data} = this.ctx;
        const dataHash = sha1(data);
        return `${dataLabel}:${dataHash}`;
    };
}
