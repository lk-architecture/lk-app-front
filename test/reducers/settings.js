import {expect} from "chai";

import {SAVE_SETTINGS} from "actions/settings";
import settings from "reducers/settings";

describe("Settings reducer", () => {

    it("Expect settings to be saved in the store", () => {

        const actionPayload = {
            awsAccessKeyId: "awsAccessKeyId",
            awsSecretAccessKey: "awsSecretAccessKey",
            awsRegion: "us-west-1",
            dynamodbEndpoint: "http://localhost:8000",
            kinesisEndpoint: "http://localhost:4567",
            s3Endpoint: "http://localhost:4568"
        };

        const action = {
            type: SAVE_SETTINGS,
            payload: actionPayload
        };

        const store = settings({}, action);

        expect(store).to.deep.equal({
            awsAccessKeyId: "awsAccessKeyId",
            awsSecretAccessKey: "awsSecretAccessKey",
            awsRegion: "us-west-1",
            dynamodbEndpoint: "http://localhost:8000",
            kinesisEndpoint: "http://localhost:4567",
            s3Endpoint: "http://localhost:4568"
        });
    });
});
