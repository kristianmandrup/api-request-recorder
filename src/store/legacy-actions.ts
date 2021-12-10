import {handleRequest} from "src/library/request/legacy";

// see https://github.com/jefflau/jest-fetch-mock
const searchGroups = async () => {
    const response = await fetch(
        "https://parseapi.back4app.com/classes/Character/1?keys=objectId,name",
        {
            headers: {
                "X-Parse-Application-Id": "kFuqGsemy2j84m8AfykdWikN2WdHEs45uGIFDV7F", // This is the fake app's application id
                "X-Parse-Master-Key": "mbUJqmLAMaVoASAkhmnOWf6am5qhmFXL5hcw0Ecf" // This is the fake app's readonly master key
            }
        }
    );
    const data = await response.json();
    return data;
};

const data = {
    number: 1000000,
    body: JSON.stringify({
        field: [
            {
                name: "groupname",
                value: "_visibility_"
            }
        ]
    })
};

export const doAction = async () => {
    return await handleRequest(searchGroups());
};
