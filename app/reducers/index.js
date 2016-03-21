import {combineReducers} from "redux";

import auth from "reducers/auth";
import environments from "reducers/environments";

export default combineReducers({
    auth,
    environments
});
