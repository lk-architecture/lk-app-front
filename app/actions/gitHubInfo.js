import axios from "axios";

export const GITHUB_INFO_START = "GITHUB_INFO_START";
export const GITHUB_INFO_SUCCESS = "GITHUB_INFO_SUCCESS";
export const GITHUB_INFO_ERROR = "GITHUB_INFO_ERROR";

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
