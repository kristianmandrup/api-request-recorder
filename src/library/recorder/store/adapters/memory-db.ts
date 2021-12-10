import {
    MemoryDBClient,
    ListTagsCommand,
    TagResourceCommand,
    TagResourceCommandOutput
} from "@aws-sdk/client-memorydb";
// import {Tag} from "@aws-sdk/client-s3";
import {ResponseRecorderStorageAdapter} from "./generic";

export interface Tags {
    Key: string;
    Value: any;
}

export class MemoryDBAdapter extends ResponseRecorderStorageAdapter {
    client: MemoryDBClient;
    params: {
        ResourceArn: string;
        Tags?: {
            Key: string;
            Value: any;
        };
    };

    constructor(config) {
        super(config);
    }

    configure() {
        const {config} = this;
        this.client = new MemoryDBClient(config.aws);
        this.params = {
            ResourceArn: config.arn
        };
    }

    async getItem(name: string) {
        const params = {
            ...this.params
        };
        try {
            const command = new ListTagsCommand(params);
            const response = await this.client.send(command);
            return response[name];
            // use generic functionality to parse and match response in returned data
        } catch (e) {
            // handle error
            throw e;
        }
    }

    async setItem(key, value): Promise<TagResourceCommandOutput> {
        const tag = {
            Key: key,
            Value: value
        };
        const params = {
            ...this.params,
            Tags: [tag]
        };
        try {
            const command = new TagResourceCommand(params);
            return await this.client.send(command);

            // use generic functionality to parse and match response in returned data
        } catch (e) {
            throw e;
        }
    }
}
