import {
    LAMBDA_UPSERT_START,
    LAMBDA_UPSERT_SUCCESS,
    LAMBDA_UPSERT_ERROR,
    LAMBDA_UPSERT_RESET
} from "actions/lambdas";

const defaultLambdaCreation = {
    fetching: false,
    upsertLambda: {},
    error: null
};
export default function lambdaCreation (state = defaultLambdaCreation, action) {
    const {payload, type} = action;
    switch (type) {
    case LAMBDA_UPSERT_START:
        return {
            fetching: true,
            error: null
        };
    case LAMBDA_UPSERT_ERROR:
        return {
            fetching: false,
            error: payload
        };
    case LAMBDA_UPSERT_SUCCESS:
        return {
            fetching: false,
            error: null,
            upsertLambda: payload
        };
    case LAMBDA_UPSERT_RESET:
        return defaultLambdaCreation;
    default:
        return state;
    }
}
