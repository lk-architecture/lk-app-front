import {
    DEPLOYMENTS_LIST_START,
    DEPLOYMENTS_LIST_SUCCESS,
    DEPLOYMENTS_LIST_ERROR
} from "actions/deployments";
import {arrayToCollection} from "lib/utils";

const defaultDeployments = {
    fetching: false,
    fetchingError: null,
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
            fetching: true,
            fetchingError: null
        };
    case DEPLOYMENTS_LIST_SUCCESS:
        return {
            fetching: false,
            fetchingError: null,
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
    default:
        return state;
    }
}
