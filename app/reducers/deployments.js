import {
    DEPLOYMENTS_LIST_START,
    DEPLOYMENTS_LIST_SUCCESS,
    DEPLOYMENTS_LIST_ERROR,
    LAMBDA_UPDATE_START,
    LAMBDA_UPDATE_ERROR,
    LAMBDA_CREATE_SUCCESS,
    LAMBDA_DELETE_SUCCESS
} from "actions/deployments";
import {arrayToCollection} from "lib/utils";

const defaultDeployments = {
    fetching: false,
    creationRunning: false,
    error: null,
    collection: {}
};

function getDeplyomentId (deploy) {
    return deploy.id;
}

export default function deployments (state = defaultDeployments, action) {
    const {type, payload} = action;
    switch (type) {
    case DEPLOYMENTS_LIST_START:
        return {
            ...state,
            error: null,
            fetching: true
        };
    case DEPLOYMENTS_LIST_SUCCESS:
        return {
            ...state,
            collection: {
                ...state.collection,
                ...arrayToCollection(getDeplyomentId, payload)
            }
        };
    case DEPLOYMENTS_LIST_ERROR:
        return {
            ...state,
            fetching: false,
            error: payload
        };
    case LAMBDA_UPDATE_START:
        return {
            ...state,
            error: null,
            creationRunning: true
        };
    case LAMBDA_UPDATE_ERROR:
        return {
            ...state,
            creationRunning: false,
            error: payload
        };
    case LAMBDA_CREATE_SUCCESS:
        return {
            ...state,
            creationRunning: false,
            collection: {
                ...state.collection,
                ...arrayToCollection(getDeplyomentId, payload)
            }
        };
    case LAMBDA_DELETE_SUCCESS:
        return {
            ...state,
            creationRunning: false,
            collection: {}
        };
    default:
        return state;
    }
}
