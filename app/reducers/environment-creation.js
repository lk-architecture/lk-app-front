import {
    ENVIRONMENT_CREATE_PROGRESS,
    ENVIRONMENT_CREATE_START,
    ENVIRONMENT_CREATE_ERROR,
    ENVIRONMENT_CREATE_RESET
} from "actions/environments";

const defaultEnvironmentCreation = {
    completed: true,
    steps: []
};

export default function environmentCreation (state = defaultEnvironmentCreation, action) {
    const {type, payload} = action;
    switch (type) {
    case ENVIRONMENT_CREATE_PROGRESS:
        return {
            ...state,
            completed: true,
            steps: state.steps.map((step) => (payload === step.id ? {
                id: step.id,
                label: step.label,
                environmentName: step.environmentName,
                completed: true,
                error:false
            } : step))
        };
    case ENVIRONMENT_CREATE_START:
        return {
            completed: false,
            steps: payload
        };
    case ENVIRONMENT_CREATE_ERROR:
        return {
            ...state,
            steps: state.steps.map((step) => (action.errorStep <= step.id ? {
                id: step.id,
                label: step.label,
                environmentName: step.environmentName,
                completed: false,
                error:true
            } : step))
        };
    case ENVIRONMENT_CREATE_RESET:
        return defaultEnvironmentCreation;
    default:
        return state;
    }
}
