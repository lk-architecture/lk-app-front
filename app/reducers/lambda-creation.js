import {
    LAMBDA_UPSERT_START,
    LAMBDA_UPSERT_SUCCESS,
    LAMBDA_UPSERT_ERROR
} from "actions/lambdas";

const defaultLambdaCreation = {
    completed: true,
    error: null
};

export default function lambdaCreation (state = defaultLambdaCreation, action) {
    const {payload, type} = action;
    switch (type) {
    case LAMBDA_UPSERT_START:
        return {
            completed: false,
            error: null
        };
    case LAMBDA_UPSERT_ERROR:
        return {
            completed: true,
            error: payload
        };
    case LAMBDA_UPSERT_SUCCESS:
        return {
            completed: true,
            error: null
        };
    default:
        return state;
    }
}
