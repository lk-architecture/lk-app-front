import {SAVE_SETTINGS} from "actions/settings";

export default function auth (state = {}, action) {
    const {type, payload} = action;
    switch (type) {
    case SAVE_SETTINGS:
        return payload;
    default:
        return state;
    }
}
