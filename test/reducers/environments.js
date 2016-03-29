import {expect} from "chai";

import {
    ENVIRONMENTS_LIST_START,
    ENVIRONMENTS_LIST_SUCCESS,
    ENVIRONMENTS_LIST_ERROR
} from "actions/environments";
import {arrayToCollection} from "lib/utils";
import environments from "reducers/environments";

describe("Environments reducer", () => {

    it("Expect starting to fetching environments", () => {
        const action = {
            type: ENVIRONMENTS_LIST_START
        };
        const store = environments({}, action);
        expect(store).to.deep.equal({
            fetching: true,
            fetchingError: null
        });
    });

    it("Expect environments to be fetched", () => {
        const payload = [{
            id: "name",
            name: "name",
            region: "us-east-1",
            services: {
                s3: {
                    eventsBucket: "lk-events-bucket-name",
                    lambdasBucket: "lk-lambdas-bucket-name"
                },
                kinesis: {
                    streamName: "lk-kinesis-stream-name",
                    shardsNumber: 1
                },
                lambda: {
                    lambdas: []
                }
            }
        }];
        const action = {
            type: ENVIRONMENTS_LIST_SUCCESS,
            payload: payload
        };
        const store = environments({}, action);
        expect(store).to.deep.equal({
            fetching: false,
            fetchingError: null,
            collection: {
                ...arrayToCollection(payload)
            }
        });
    });

    it("Expect error while fetching environments", () => {
        const error = "Error while fetching environments";
        const action = {
            type: ENVIRONMENTS_LIST_ERROR,
            payload: error
        };
        const store = environments({}, action);
        expect(store).to.deep.equal({
            fetching: false,
            fetchingError: error
        });
    });
});
