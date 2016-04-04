import {
    LAMBDAS_LIST_START,
    LAMBDAS_LIST_SUCCESS,
    LAMBDAS_LIST_ERROR
} from "actions/lambdas";
import {arrayToCollection} from "lib/utils";

const defaultLambdas = {
    fetching: false,
    fetchingError: null,
    collection: {}
};

function getLambdaId (lambda) {
    return `${lambda.name}-${lambda.environmentName}`;
}

export default function lambdas (state = defaultLambdas, action) {
    const {type, payload} = action;
    switch (type) {
    case LAMBDAS_LIST_START:
        return {
            ...state,
            fetching: true,
            fetchingError: null
        };
    case LAMBDAS_LIST_SUCCESS:
        return {
            fetching: false,
            fetchingError: null,
            collection: {
                ...state.collection,
                ...arrayToCollection(getLambdaId, payload)
            }
        };
    case LAMBDAS_LIST_ERROR:
        return {
            ...state,
            fetching: false,
            fetchingError: payload
        };
    default:
        return state;
    }
}
