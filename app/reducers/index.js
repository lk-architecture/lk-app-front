import {combineReducers} from "redux";
import {reducer as form} from "redux-form";

import environments from "reducers/environments";
import hasRehydrated from "reducers/has-rehydrated";
import settings from "reducers/settings";

export default combineReducers({
    environments,
    form,
    hasRehydrated,
    settings
});
