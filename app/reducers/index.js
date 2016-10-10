import {combineReducers} from "redux";
import {reducer as form} from "redux-form";

import environmentCreation from "reducers/environment-creation";
import environments from "reducers/environments";
import deployments from "reducers/deployments";
import hasRehydrated from "reducers/has-rehydrated";
import lambdaCreation from "reducers/lambda-creation";
import lambdas from "reducers/lambdas";
import settings from "reducers/settings";
import gitHubInfo from "reducers/gitHubInfo";
import settingsCreation from "reducers/settings-creation";

export default combineReducers({
    environmentCreation,
    environments,
    deployments,
    form,
    hasRehydrated,
    lambdaCreation,
    lambdas,
    settings,
    gitHubInfo,
    settingsCreation
});
