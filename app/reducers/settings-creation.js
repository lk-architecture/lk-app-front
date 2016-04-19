import {RESET_SETTINGS_PROGRESS, SAVE_SETTINGS} from "actions/settings";

const defaultSettingsCreation = {
    completed: false,
    error: null
};

export default function settingsCreation (state = defaultSettingsCreation, action) {
    const {type} = action;
    switch (type) {
    case SAVE_SETTINGS:
        return {
            completed: true,
            error: null
        };
    case RESET_SETTINGS_PROGRESS:
        return {
            completed: false,
            error: null
        };
    default:
        return state;
    }
}
