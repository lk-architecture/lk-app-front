import {
    GITHUB_INFO_START,
    GITHUB_INFO_SUCCESS,
    GITHUB_INFO_ERROR,
    REPO_INFO_START,
    REPO_INFO_SUCCESS,
    REPO_INFO_ERROR,
    GITHUB_STATUS_START,
    GITHUB_STATUS_SUCCESS,
    GITHUB_STATUS_ERROR
} from "actions/github-info";

const defaultGithubInfo = {
    error: false,
    loading: false,
    general: {},
    commits: {},
    repoInfo: [],
    githubStatus:{}
};

export default function githubInfo (state = defaultGithubInfo, action) {
    const {type, payload} = action;

    switch (type) {
    case GITHUB_INFO_START:
    case GITHUB_STATUS_START:
    case REPO_INFO_START:
        return {
            ...state,
            loading: true,
            error: false
        };
    case GITHUB_INFO_SUCCESS:
        return {
            ...state,
            error: false,
            loading: false,
            general: payload.general,
            commits: payload.commits
        };
    case REPO_INFO_SUCCESS:
        return {
            ...state,
            error: false,
            loading: false,
            repoInfo: payload
        };
    case GITHUB_STATUS_SUCCESS:
        return {
            ...state,
            error: false,
            loading: false,
            githubStatus: payload
        };
    case GITHUB_INFO_ERROR:
    case GITHUB_STATUS_ERROR:
    case REPO_INFO_ERROR:
        return {
            ...state,
            error: true,
            loading: false
        };
    default:
        return state;
    }
}
