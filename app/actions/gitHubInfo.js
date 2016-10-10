import axios from "axios";

export const GITHUB_INFO_START = "GITHUB_INFO_START";
export const GITHUB_INFO_SUCCESS = "GITHUB_INFO_SUCCESS";
export const GITHUB_INFO_ERROR = "GITHUB_INFO_ERROR";

export function getGitHubInfo  (props) {
    const {lambda} = props;
    return  async dispatch => {
        try {
            dispatch({type: GITHUB_INFO_START});

            // GET general info from github
            const general = (lambda.github.org && lambda.name ?
            await axios.get(
                `https://raw.githubusercontent.com/${lambda.github.org}/${lambda.name}/master/package.json`
            )
            : null);

            // GET commit info from github
            const commits = (lambda.github.org && lambda.name ?
            await axios.get(
                `https://api.github.com/repos/${lambda.github.org}/${lambda.name}/commits?path=package.json`
            )
            : null);

            const payloadObject = {
                general: general.data,
                commits: commits.data
            };

            dispatch({
                type: GITHUB_INFO_SUCCESS,
                payload : payloadObject
            });
        } catch (error) {
            dispatch({
                type: GITHUB_INFO_ERROR,
                payload: error,
                error: true
            });
        }
    };
}
