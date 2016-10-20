import {expect} from "chai";

import {
    ENVIRONMENT_CREATE_PROGRESS,
    ENVIRONMENT_CREATE_START,
    ENVIRONMENT_CREATE_ERROR
} from "actions/environments";

import environmentCreation from "reducers/environment-creation";

describe("Environment Create reducer", () => {

    it("Expect starting to fetching environment create step 0", () => {
        const data = 0;
        const action = {
            type: ENVIRONMENT_CREATE_PROGRESS,
            payload: data
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:true,
            steps:[]
        });
    });

    it("Expect starting to fetching environment create step 1", () => {
        const data = 1;
        const action = {
            type: ENVIRONMENT_CREATE_PROGRESS,
            payload: data
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:true,
            steps:[]
        });
    });

    it("Expect starting to fetching environment create step 2", () => {
        const data = 2;
        const action = {
            type: ENVIRONMENT_CREATE_PROGRESS,
            payload: data
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:true,
            steps:[]
        });
    });

    it("Expect environment create in progress to be fetched step 0", () => {

        const action = {
            type: ENVIRONMENT_CREATE_START,
            payload: 0
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:false,
            steps: 0
        });
    });

    it("Expect environment create in progress to be fetched step 1", () => {

        const action = {
            type: ENVIRONMENT_CREATE_START,
            payload: 1
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:false,
            steps: 1
        });
    });

    it("Expect environment create in progress to be fetched step 1", () => {

        const action = {
            type: ENVIRONMENT_CREATE_START,
            payload: 2
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:false,
            steps: 2
        });
    });

    it("Expect error while fetching environment create", () => {
        const data = [];
        const action = {
            type: ENVIRONMENT_CREATE_ERROR,
            payload: data
        };

        const ret = environmentCreation(undefined, action);
        expect(ret).to.deep.equal({
            completed:true,
            steps:[]
        });
    });
});
