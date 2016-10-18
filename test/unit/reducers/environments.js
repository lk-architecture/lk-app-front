import {expect} from "chai";

import {
     ENVIRONMENTS_LIST_START,
     ENVIRONMENTS_LIST_SUCCESS,
     ENVIRONMENTS_LIST_ERROR
 } from "actions/environments";
import environments from "reducers/environments";

describe("Environments reducer", () => {
    it("Expect starting to fetching environments", () => {
        const action = {
            type: ENVIRONMENTS_LIST_START
        };
        const ret = environments({}, action);
        expect(ret).to.deep.equal({
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
                    eventsBucket: "envents",
                    lambdasBucket: "lambda"
                },
                kinesis: {
                    streamName: "stream-name",
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
        const ret = environments({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            fetchingError: null,
            collection: {
                name: {
                    id: "name",
                    name: "name",
                    region: "us-east-1",
                    services: {
                        kinesis: {
                            shardsNumber: 1,
                            streamName: "stream-name",
                        },
                        lambda: {
                            lambdas: []
                        },
                        s3: {
                            eventsBucket: "envents",
                            lambdasBucket: "lambda"
                        }
                    }
                }
            }
        });
    });

    it("Expect error while fetching environments", () => {
        const error = "Error while fetching environments";
        const action = {
            type: ENVIRONMENTS_LIST_ERROR,
            payload: error
        };
        const ret = environments({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            fetchingError: error
        });
    });
});
