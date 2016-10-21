import {expect} from "chai";

import {
    GITHUB_INFO_START,
    GITHUB_INFO_SUCCESS,
    GITHUB_INFO_ERROR,
    REPO_INFO_START,
    REPO_INFO_SUCCESS,
    REPO_INFO_ERROR
} from "actions/github-info";

import githubInfo from "reducers/github-info";

describe("GithubInfo reducer", () => {
    it("Expect starting to fetching github info", () => {
        const action = {
            type: GITHUB_INFO_START,
        };
        const ret = githubInfo({}, action);
        expect(ret).to.deep.equal({
            error:false,
            loading:true
        });
    });

    it("Expect starting to fetching repo info", () => {
        const action = {
            type: REPO_INFO_START,
        };
        const ret = githubInfo({}, action);
        expect(ret).to.deep.equal({
            error:false,
            loading:true
        });
    });

    it("Expect githubInfo to be fetched", () => {
        const input = {
            general:{
                name:"name",
                version:"2.0.0",
                description:"description",
                author:"author",
                license:"Apache-2.0"
            },
            commits:[{
                sha:"id",
                commit:{
                    author:{
                        name:"name",
                        email:"mail",
                        date:"2016-05-10T19:08:14Z"
                    },
                    message:"2.0.0",
                },
            }]
        };
        const action = {
            type: GITHUB_INFO_SUCCESS,
            payload: input
        };
        const ret = githubInfo({}, action);
        expect(ret).to.deep.equal({
            error:false,
            loading:false,
            general:input.general,
            commits:input.commits
        });
    });

    it("Expect repoInfo to be fetched", () => {
        const input ={
            "repo":{
                data:[]
            }
        };
        const action = {
            type: REPO_INFO_SUCCESS,
            payload: input
        };
        const ret = githubInfo({}, action);
        expect(ret).to.deep.equal({
            error:false,
            loading:false,
            repoInfo: input
        });
    });

    it("Expect error while fetching github info", () => {

        const action = {
            type: GITHUB_INFO_ERROR
        };
        const ret = githubInfo({}, action);
        expect(ret).to.deep.equal({
            error:true,
            loading:false
        });
    });

    it("Expect error while fetching repo info", () => {

        const action = {
            type: REPO_INFO_ERROR
        };
        const ret = githubInfo({}, action);
        expect(ret).to.deep.equal({
            error:true,
            loading:false
        });
    });
});
