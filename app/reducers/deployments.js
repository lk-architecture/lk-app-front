import {
    DEPLOYMENTS_LIST_START,
    DEPLOYMENTS_LIST_SUCCESS,
    DEPLOYMENTS_LIST_ERROR,
    DEPLOYMENT_CREATE_START,
    DEPLOYMENT_CREATE_ERROR,
    DEPLOYMENT_CREATE_SUCCESS
} from "actions/deployments";
import {arrayToCollection} from "lib/utils";

const defaultDeployments = {
    fetching: false,
    fetchingError: null,
    creationRunning: false,
    creationError: null,
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
            fetchingError: payload
        };
    case DEPLOYMENT_CREATE_START:
        return {
            ...state,
            creationRunning: true
        };
    case DEPLOYMENT_CREATE_ERROR:
        return {
            ...state,
            creationError: payload
        };
    case DEPLOYMENT_CREATE_SUCCESS:
        return {
            ...state,
            creationRunning: false,
            collection: {
                ...state.collection,
                ...arrayToCollection(getDeplyomentId, payload)
            }
        };
    default:
        return state;
    }
}
