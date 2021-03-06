import {
    ENVIRONMENTS_LIST_START,
    ENVIRONMENTS_LIST_SUCCESS,
    ENVIRONMENTS_LIST_ERROR
} from "actions/environments";
import {arrayToCollection} from "lib/utils";

const defaultEnvironments = {
    fetching: false,
    fetchingError: null,
    collection: {}
};

function getEnvironmentId (environment) {
    return environment.name;
}

export default function environments (state = defaultEnvironments, action) {
    const {type, payload} = action;
    switch (type) {
    case ENVIRONMENTS_LIST_START:
        return {
            ...state,
            fetching: true,
            fetchingError: null
        };
    case ENVIRONMENTS_LIST_SUCCESS:
        return {
            fetching: false,
            fetchingError: null,
            collection: {
                ...state.collection,
                ...arrayToCollection(getEnvironmentId, payload)
            }
        };
    case ENVIRONMENTS_LIST_ERROR:
        return {
            ...state,
            fetching: false,
            fetchingError: payload
        };
    default:
        return state;
    }
}
