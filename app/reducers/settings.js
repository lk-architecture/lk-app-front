import {NODE_ENV} from "config";
import {SAVE_SETTINGS} from "actions/settings";

export default function settings (state = {}, action) {
    if (NODE_ENV === "development") {
        return {
            awsAccessKeyId: "awsAccessKeyId",
            awsSecretAccessKey: "awsSecretAccessKey",
            awsRegion: "us-west-1",
            dynamodbEndpoint: "http://localhost:8000"
        };
    }
    const {type, payload} = action;
    switch (type) {
    case SAVE_SETTINGS:
        return payload;
    default:
        return state;
    }
}
