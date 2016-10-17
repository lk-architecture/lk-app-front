import {
    GITHUB_INFO_START,
    GITHUB_INFO_SUCCESS,
    GITHUB_INFO_ERROR,
    REPO_INFO_START,
    REPO_INFO_SUCCESS,
    REPO_INFO_ERROR
} from "actions/gitHubInfo";

const defaultGitHubInfo = {
    error: false,
    loading: false,
    general: {},
    commits: {},
    repoInfo: []
};

export default function gitHubInfo (state = defaultGitHubInfo, action) {
    const {type, payload} = action;
    switch (type) {
    case GITHUB_INFO_START:
    case REPO_INFO_START:
        return {
            ...state,
            loading: true,
            error: false
        };
    case GITHUB_INFO_SUCCESS:
        return {
            error: false,
            loading: false,
            general: payload.general,
            commits: payload.commits
        };
    case REPO_INFO_SUCCESS:
        return {
            error: false,
            loading: false,
            repoInfo: payload
        };
    case GITHUB_INFO_ERROR:
    case REPO_INFO_ERROR:
        return {
            error: true,
            loading: false
        };
    default:
        return state;
    }
}
