import {LOGIN, LOGOUT} from "actions/auth";

const defaultAuth = {
    isLoggedIn: false,
    credentials: null
};

export default function auth (state = defaultAuth, action) {
    const {type, payload} = action;
    switch (type) {
    case LOGIN:
        return {
            isLoggedIn: true,
            credentials: payload
        };
    case LOGOUT:
        return defaultAuth;
    default:
        return state;
    }
}
