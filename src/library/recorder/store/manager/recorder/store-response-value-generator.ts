export class StoreResponseValueGenerator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createResponseValue = ({response, time}, _) => {
        return {
            response,
            time
        };
    };
}
