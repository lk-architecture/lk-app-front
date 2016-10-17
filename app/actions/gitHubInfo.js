import axios from "axios";
import {map} from "bluebird";

export const GITHUB_INFO_START = "GITHUB_INFO_START";
export const GITHUB_INFO_SUCCESS = "GITHUB_INFO_SUCCESS";
export const GITHUB_INFO_ERROR = "GITHUB_INFO_ERROR";

export const REPO_INFO_START = "REPO_INFO_START";
export const REPO_INFO_SUCCESS = "REPO_INFO_SUCCESS";
export const REPO_INFO_ERROR = "REPO_INFO_ERROR";

export function listRepoInfo (repo = []) {
    return  async dispatch => {
        try {
            dispatch({type: REPO_INFO_START});
            // GET repo info from github
            const payloadObject = await map(repo, value => {
                return axios.get(
                    `https://api.github.com/orgs/${value}/repos?per_page=100`
                ).catch(err => {
                    console.log(err);
                    return axios.get(
                        `https://api.github.com/users/${value}/repos?per_page=100`
                    ).catch(err => {
                        console.log(err);
                    });
                });
            });

            const result  = repo.reduce((acc, value, index) => {
                return {
                    ...acc,
                    [value]: payloadObject[index]
                };
            }, {});

            dispatch({
                type: REPO_INFO_SUCCESS,
                payload : result,
                error: false
            });
        } catch (error) {

            dispatch({
                type: REPO_INFO_ERROR,
                payload : [],
                error: true
            });
        }
    };
}

export function getGitHubInfo  (github = {}) {
    return  async dispatch => {
        try {
            dispatch({type: GITHUB_INFO_START});
            const {org, repo} = github;
            // GET general info from github
            const general = await axios.get(
                `https://raw.githubusercontent.com/${org}/${repo}/master/package.json`
            );

            // GET commit info from github
            const commits = await axios.get(
                `https://api.github.com/repos/${org}/${repo}/commits?path=package.json`
            );

            const payloadObject = {
                general: general.data,
                commits: commits.data
            };

            dispatch({
                type: GITHUB_INFO_SUCCESS,
                payload : payloadObject,
                error: false
            });
        } catch (error) {

            dispatch({
                type: GITHUB_INFO_ERROR,
                payload : {},
                error: true
            });
        }
    };
}
