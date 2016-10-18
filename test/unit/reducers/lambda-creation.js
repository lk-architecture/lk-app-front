import {expect} from "chai";

import {
    LAMBDA_UPSERT_START,
    LAMBDA_UPSERT_SUCCESS,
    LAMBDA_UPSERT_ERROR
} from "actions/lambdas";

import lambdaCreation from "reducers/lambda-creation";

describe("Lambda Creation reducer", () => {
    it("Expect starting to fetching lambda upsert", () => {
        const action = {
            type: LAMBDA_UPSERT_START,
        };

        const ret = lambdaCreation({}, action);
        expect(ret).to.deep.equal({
            completed: false,
            error:null
        });
    });

    it("Expect lambda upsert to be fetched", () => {
        const action = {
            type: LAMBDA_UPSERT_SUCCESS,
        };

        const ret = lambdaCreation({}, action);
        expect(ret).to.deep.equal({
            completed: true,
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
            completed: true,
            error:error
        });
    });
});
