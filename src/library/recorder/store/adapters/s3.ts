import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3"; // ES Modules import
import {ResponseRecorderStorageAdapter} from "./generic";

export class S3BucketAdapter extends ResponseRecorderStorageAdapter {
    client: S3Client;
    params: {
        Bucket: any;
        Key?: string;
    };

    constructor(config) {
        super(config);
    }

    configure() {
        const {config} = this;
        this.client = new S3Client(config);
        this.params = {
            Bucket: config.bucket
        };
    }

    async getItem(key: string): Promise<any> {
        const {client, params} = this;
        const commandInput = {
            ...params,
            Key: key
        };
        const command = new GetObjectCommand(commandInput);
        return await client.send(command);
    }

    async setItem(key: string, value: any): Promise<any> {
        const {client, params} = this;
        const tag = {
            Key: key,
            Value: value
        };
        const commandInput = {
            ...params,
            ...tag
        };
        const command = new PutObjectCommand(commandInput);
        return await client.send(command);
    }
}
