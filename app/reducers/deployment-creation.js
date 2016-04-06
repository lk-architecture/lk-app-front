import {
    DEPLOYMENT_CREATE_START,
    DEPLOYMENT_CREATE_SUCCESS,
    DEPLOYMENT_CREATE_ERROR
} from "actions/deployments";

const defaultDeploymentCreation = {
    completed: true,
    error: null
};

export default function deploymentCreation (state = defaultDeploymentCreation, action) {
    const {payload, type} = action;
    switch (type) {
    case DEPLOYMENT_CREATE_START:
        return {
            completed: false,
            error: null
        };
    case DEPLOYMENT_CREATE_ERROR:
        return {
            completed: true,
            error: payload
        };
    case DEPLOYMENT_CREATE_SUCCESS:
        return {
            completed: true,
            error: null
        };
    default:
        return state;
    }
}
