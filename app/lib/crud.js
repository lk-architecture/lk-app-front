import {resolve} from "bluebird";

import axios, {AxiosError} from "lib/axios";

function createActions (collectionName) {
    console.log(collectionName);
}

function createReducers (collectionName) {
    console.log(collectionName);
}

export function createCollection (collectionName) {
    return {
        actions: createActions(collectionName),
        constants: createConstants(collectionName),
        reducers: createReducers(collectionName)
    };
}

export const ENVIRONMENTS_LIST_START = "ENVIRONMENTS_LIST_START";
export const ENVIRONMENTS_LIST_SUCCESS = "ENVIRONMENTS_LIST_SUCCESS";
export const ENVIRONMENTS_LIST_ERROR = "ENVIRONMENTS_LIST_ERROR";

export function listApps () {
    return dispatch => {
        resolve()
            .then(() => {
                dispatch({type: ENVIRONMENTS_LIST_START});
                axios.get("/apps");
            })
            .then(res => dispatch({
                type: ENVIRONMENTS_LIST_SUCCESS,
                payload: res.data
            }))
            .catch(err => {
                /*
                *   We want to dispatch a GET_CODE_STATS_ERROR action only when
                *   `axios.get` fails (the error is an AxiosError). In all other
                *   cases we rethrow the error.
                */
                if (err instanceof AxiosError) {
                    dispatch({
                        type: ENVIRONMENTS_LIST_ERROR,
                        payload: err,
                        error: true
                    });
                } else {
                    throw err;
                }
            })
            .catch(err => {
                /*
                *   We cannot recover from a dispatch error. Therefore we
                *   only log it.
                */
                console.error(err);
            });
    };
}

export const ENVIRONMENT_CREATE_START = "ENVIRONMENT_CREATE_START";
export const ENVIRONMENT_CREATE_SUCCESS = "ENVIRONMENT_CREATE_SUCCESS";
export const ENVIRONMENT_CREATE_ERROR = "ENVIRONMENT_CREATE_ERROR";

export function createApp (domain) {
    return dispatch => {
        dispatch({type: ENVIRONMENT_CREATE_START});
        axios.post("/apps", {domain})
            .then(res => dispatch({
                type: ENVIRONMENT_CREATE_SUCCESS,
                payload: res.data
            }))
            // TODO better handle error
            .catch(err => dispatch({
                type: ENVIRONMENT_CREATE_ERROR,
                payload: err,
                error: true
            }));
    };
}

export const ENVIRONMENT_GET_START = "ENVIRONMENT_GET_START";
export const ENVIRONMENT_GET_SUCCESS = "ENVIRONMENT_GET_SUCCESS";
export const ENVIRONMENT_GET_ERROR = "ENVIRONMENT_GET_ERROR";

export function getApp (appId) {
    return dispatch => {
        dispatch({type: ENVIRONMENT_GET_START});
        axios.get(`/apps/${appId}`)
            .then(res => dispatch({
                type: ENVIRONMENT_GET_SUCCESS,
                payload: res.data
            }))
            // TODO better handle error
            .catch(err => dispatch({
                type: ENVIRONMENT_GET_ERROR,
                payload: err,
                error: true
            }));
    };
}

export const ENVIRONMENT_STAGE_CREATE_START = "ENVIRONMENT_STAGE_CREATE_START";
export const ENVIRONMENT_STAGE_CREATE_SUCCESS = "ENVIRONMENT_STAGE_CREATE_SUCCESS";
export const ENVIRONMENT_STAGE_CREATE_ERROR = "ENVIRONMENT_STAGE_CREATE_ERROR";

export function createStage (appId, stageName) {
    return dispatch => {
        dispatch({type: ENVIRONMENT_STAGE_CREATE_START});
        axios.post(`/apps/${appId}/stages`, {name: stageName})
            .then(res => dispatch({
                type: ENVIRONMENT_STAGE_CREATE_SUCCESS,
                payload: res.data
            }))
            // TODO better handle error
            .catch(err => dispatch({
                type: ENVIRONMENT_STAGE_CREATE_ERROR,
                payload: err,
                error: true
            }));
    };
}
