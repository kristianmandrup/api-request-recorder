import {
    AddTagsToResourceCommand,
    ElastiCacheClient,
    ListTagsForResourceCommand
} from "@aws-sdk/client-elasticache";
import {ResponseRecorderStorageAdapter} from "./generic";
import {Tags} from "./types";

export class ElastiCacheAdapter extends ResponseRecorderStorageAdapter {
    client: ElastiCacheClient;
    params: {
        ResourceName: string;
        Tags?: Tags;
    };

    constructor(config: any) {
        super(config);
    }

    configure() {
        const {config} = this;
        this.client = new ElastiCacheClient(config.aws);
        this.params = {
            ResourceName: config.resourceName || config.arn
        };
    }

    async getItem(name) {
        const params = {
            ...this.params
        };
        try {
            const command = new ListTagsForResourceCommand(params);
            const response = await this.client.send(command);
            return response[name];

            // use generic functionality to parse and match response in returned data
        } catch (e) {
            // handle error
        }
    }

    async setItem(key, value) {
        const tag = {
            Key: key,
            Value: value
        };
        const params = {
            ...this.params,
            Tags: [tag]
        };
        try {
            const command = new AddTagsToResourceCommand(params);
            const data = await this.client.send(command);
            return data;
        } catch (e) {
            // handle error
        }
    }
}
