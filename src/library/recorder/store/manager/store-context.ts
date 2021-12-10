export abstract class BaseStoreContext {
    ctx: any;
    reqMethod: string;
    apiId: string;

    constructor(ctx) {
        this.ctx = ctx;
        this.reqMethod = ctx.reqMethod;
        this.apiId = ctx.apiId;
    }
}
