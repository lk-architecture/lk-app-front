import {expect} from "chai";

import {
    DEPLOYMENTS_LIST_START, DEPLOYMENTS_LIST_SUCCESS, DEPLOYMENTS_LIST_ERROR,
    LAMBDA_DEPLOY_START, LAMBDA_DEPLOY_ERROR, LAMBDA_DEPLOY_SUCCESS, LAMBDA_DELETE_SUCCESS
} from "actions/deployments";
import deployments from "reducers/deployments";

describe("Deployments reducer", () => {
    it("Expect starting to fetching deployments", () => {
        const action = {
            type: DEPLOYMENTS_LIST_START
        };
        const ret = deployments({}, action);
        expect(ret).to.deep.equal({
            fetching: true,
            error: null
        });
    });

    it("Expect deployments to be fetched", () => {
        const input = [{
            id:"1",
            lambdaRole:"role1",
            lambdaName:"name1",
            environmentName:"prod",
            githubRef:"github",
            awsRegion:"eu-west-1",
            timestamp:"2016-08-25T14:10:05.012Z",
            environmentVariables:[{
                value:"1",
                key:"VAR2"
            }]
        }, {
            id:"2",
            lambdaRole:"role2",
            lambdaName:"name2",
            environmentName:"prod",
            githubRef:"github",
            awsRegion:"eu-west-1",
            timestamp:"2016-08-25T14:10:05.012Z",
            environmentVariables:[{
                value:"1",
                key:"VAR"
            }, {
                value:"1",
                key:"VAR2"
            }]
        }];

        const output = {
            "1": {
                awsRegion: "eu-west-1",
                environmentName: "prod",
                environmentVariables:[{
                    key: "VAR2",
                    value: "1",
                }],
                githubRef: "github",
                id: "1",
                lambdaName: "name1",
                lambdaRole: "role1",
                timestamp: "2016-08-25T14:10:05.012Z"
            },
            "2": {
                awsRegion: "eu-west-1",
                environmentName: "prod",
                environmentVariables: [{
                    key: "VAR",
                    value: "1",
                }, {
                    key: "VAR2",
                    value: "1",
                }],
                githubRef: "github",
                id: "2",
                lambdaName: "name2",
                lambdaRole: "role2",
                timestamp: "2016-08-25T14:10:05.012Z"
            }
        };

        const action = {
            type: DEPLOYMENTS_LIST_SUCCESS,
            payload: input
        };
        const ret = deployments({}, action);
        expect(ret).to.deep.equal({
            collection: output
        });
    });

    it("Expect error while fetching deployments", () => {
        const error = "Error while fetching deployments";
        const action = {
            type: DEPLOYMENTS_LIST_ERROR,
            payload: error
        };
        const ret = deployments({}, action);

        expect(ret).to.deep.equal({
            fetching: false,
            error: error
        });
    });

    it("Expect starting to fetching lambda deploy", () => {
        const action = {
            type: LAMBDA_DEPLOY_START
        };
        const ret = deployments({}, action);

        expect(ret).to.deep.equal({
            creationRunning: true,
            error: null
        });
    });

    it("Expect lambda deploy to be fetched", () => {
        const input = [{
            id:"1",
            lambdaRole:"role",
            lambdaName:"lambdaName1",
            environmentName:"prod",
            githubRef:"ref",
            awsRegion:"eu-west-1",
            timestamp:"2016-08-25T14:10:05.012Z",
            environmentVariables:[{
                value:"1",
                key:"KEY"
            }]
        }, {
            id:"2",
            lambdaRole:"role",
            lambdaName:"lambdaName2",
            environmentName:"prod",
            githubRef:"ref",
            awsRegion:"eu-west-1",
            timestamp:"2016-08-25T14:10:05.012Z",
            environmentVariables:[{
                value:"1",
                key:"KEY"
            }]
        }];

        const output = {
            "1": {
                awsRegion: "eu-west-1",
                environmentName: "prod",
                environmentVariables:[{
                    key: "KEY",
                    value: "1"
                }],
                githubRef: "ref",
                id: "1",
                lambdaName: "lambdaName1",
                lambdaRole: "role",
                timestamp: "2016-08-25T14:10:05.012Z"},
            "2": {
                awsRegion: "eu-west-1",
                environmentName: "prod",
                environmentVariables:[{
                    key: "KEY",
                    value: "1"
                }],
                githubRef: "ref",
                id: "2",
                lambdaName: "lambdaName2",
                lambdaRole: "role",
                timestamp: "2016-08-25T14:10:05.012Z"
            }
        };

        const action = {
            type: LAMBDA_DEPLOY_SUCCESS,
            payload: input
        };
        const ret = deployments({}, action);

        expect(ret).to.deep.equal({
            collection: output,
            creationRunning: false
        });
    });


    it("Expect lambda delete to be fetched", () => {
        const action = {
            type: LAMBDA_DELETE_SUCCESS
        };
        const ret = deployments({}, action);
        expect(ret).to.deep.equal({
            creationRunning: false,
            collection: {}
        });
    });

    it("Expect error while fetching lambda deploy", () => {
        const error = "Error while fetching lambda deploy";
        const action = {
            type: LAMBDA_DEPLOY_ERROR,
            payload: error
        };
        const ret = deployments({}, action);

        expect(ret).to.deep.equal({
            creationRunning: false,
            error: error
        });
    });
});
