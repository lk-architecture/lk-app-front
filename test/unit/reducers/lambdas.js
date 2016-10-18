import {expect} from "chai";

import {
    LAMBDAS_LIST_START,
    LAMBDAS_LIST_SUCCESS,
    LAMBDAS_LIST_ERROR
} from "actions/lambdas";

import getLambdaId from "reducers/lambdas";

describe("Lambdas reducer", () => {
    it("Expect starting to fetching lambdas list", () => {
        const action = {
            type: LAMBDAS_LIST_START,
        };

        const ret = getLambdaId({}, action);
        expect(ret).to.deep.equal({
            fetching: true,
            fetchingError:null
        });
    });

    it("Expect lambdas list to be fetched", () => {

        const input = [{
            role:"role/Lambda",
            github:{
                repo:"repo1",
                org:"org1"
            },
            name:"lambda",
            environmentVariables:[{
                value:"entrypoint",
                key:"KINESIS_STREAM_NAME"
            }],
            environmentName:"prod"
        }, {
            role:"role/Lambda",
            github:{
                repo:"repo2",
                org:"org2"
            },
            name:"lambda",
            environmentVariables:[{
                value:"entrypoint",
                key:"KINESIS_STREAM_NAME"
            }],
            environmentName:"prod"
        }];

        const output = {
            "lambda-prod": {
                environmentName: "prod",
                environmentVariables:[{
                    key: "KINESIS_STREAM_NAME",
                    value: "entrypoint"
                }],
                github: {
                    org: "org2",
                    repo: "repo2"
                },
                id: "lambda-prod",
                name: "lambda",
                role: "role/Lambda"
            }
        };

        const action = {
            type: LAMBDAS_LIST_SUCCESS,
            payload:input
        };

        const ret = getLambdaId({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            fetchingError:null,
            collection: output
        });
    });

    it("Expect error while fetching lambdas list", () => {
        const error = "Error lambdas list";
        const action = {
            type: LAMBDAS_LIST_ERROR,
            payload: error
        };

        const ret = getLambdaId({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            fetchingError:error
        });
    });
});
