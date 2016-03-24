import {combineReducers} from "redux";
import {reducer as form} from "redux-form";

import environmentCreation from "reducers/environment-creation";
import environments from "reducers/environments";
import hasRehydrated from "reducers/has-rehydrated";
import settings from "reducers/settings";

export default combineReducers({
    environmentCreation,
    environments,
    form,
    hasRehydrated,
    settings
});
