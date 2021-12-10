import {StoreRecorder, StoreRetriever} from ".";

export type CreateStoreManagerParams = {retriever: StoreRetriever; recorder: StoreRecorder};

export const createStoreManager = (params: CreateStoreManagerParams): StoreManager =>
    new StoreManager(params);

export class StoreManager {
    retriever: StoreRetriever;
    recorder: StoreRecorder;

    constructor({retriever, recorder}: CreateStoreManagerParams) {
        this.retriever = retriever;
        this.recorder = recorder;
    }
}
