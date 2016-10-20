import {expect} from "chai";

import {
    LAMBDA_UPSERT_START,
    LAMBDA_UPSERT_SUCCESS,
    LAMBDA_UPSERT_ERROR,
    LAMBDA_UPSERT_RESET
} from "actions/lambdas";

import lambdaCreation from "reducers/lambda-creation";

describe("Lambda Creation reducer", () => {
    it("Expect starting to fetching lambda upsert", () => {
        const action = {
            type: LAMBDA_UPSERT_START,
        };

        const ret = lambdaCreation({}, action);
        expect(ret).to.deep.equal({
            fetching: true,
            error:null
        });
    });

    it("Expect lambda upsert to be fetched", () => {
        const input = {
            name:"test13",
            environmentName:"deleteme",
            github:{
                org:"test13",
                repo:"test13"
            },
            role:"test13"};
        const action = {
            type: LAMBDA_UPSERT_SUCCESS,
            payload: input
        };

        const ret = lambdaCreation({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            upsertLambda: input,
            error:null
        });
    });

    it("Expect error while fetching lambda upsert", () => {
        const error = "Error lambda upsert";
        const action = {
            type: LAMBDA_UPSERT_ERROR,
            payload: error
        };

        const ret = lambdaCreation({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            error:error
        });
    });

    it("Expect lambda upsert reset to be fetched", () => {
        const action = {
            type: LAMBDA_UPSERT_RESET
        };

        const ret = lambdaCreation({}, action);
        expect(ret).to.deep.equal({
            fetching: false,
            upsertLambda: {},
            error: null
        });
    });

});
