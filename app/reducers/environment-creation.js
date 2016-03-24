import {
    ENVIRONMENT_CREATE_PROGRESS,
    ENVIRONMENT_CREATE_START
} from "actions/environments";

export default function environments (state = [], action) {
    const {type, payload} = action;
    switch (type) {
    case ENVIRONMENT_CREATE_PROGRESS:
        return state.map((step) => (payload === step.id ? {
            id: step.id,
            label: step.label,
            completed: true
        } : step));
    case ENVIRONMENT_CREATE_START:
        return payload;
    default:
        return state;
    }
}
