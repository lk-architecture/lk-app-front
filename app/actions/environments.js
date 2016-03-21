import {resolve} from "bluebird";

import {} from "lib/axios";

export const ENVIRONMENTS_LIST_START = "ENVIRONMENTS_LIST_START";
export const ENVIRONMENTS_LIST_SUCCESS = "ENVIRONMENTS_LIST_SUCCESS";
export const ENVIRONMENTS_LIST_ERROR = "ENVIRONMENTS_LIST_ERROR";

export function listEnvironments () {
    return dispatch => {
    };
}

// export const ENVIRONMENT_CREATE_START = "ENVIRONMENT_CREATE_START";
// export const ENVIRONMENT_CREATE_SUCCESS = "ENVIRONMENT_CREATE_SUCCESS";
// export const ENVIRONMENT_CREATE_ERROR = "ENVIRONMENT_CREATE_ERROR";
//
// export function createEnvironment (domain) {
// }
//
// export const ENVIRONMENT_GET_START = "ENVIRONMENT_GET_START";
// export const ENVIRONMENT_GET_SUCCESS = "ENVIRONMENT_GET_SUCCESS";
// export const ENVIRONMENT_GET_ERROR = "ENVIRONMENT_GET_ERROR";
//
// export function getEnvironment (appId) {
// }
