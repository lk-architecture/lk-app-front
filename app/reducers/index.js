import {combineReducers} from "redux";
import {reducer as form} from "redux-form";

import environmentCreation from "reducers/environment-creation";
import environments from "reducers/environments";
import hasRehydrated from "reducers/has-rehydrated";
import lambdas from "reducers/lambdas";
import settings from "reducers/settings";

export default combineReducers({
    environmentCreation,
    environments,
    form,
    hasRehydrated,
    lambdas,
    settings
});
