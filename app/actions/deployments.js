import axios from "axios";

import store from "lib/store";

export const DEPLOYMENT_CREATE_START = "DEPLOYMENT_CREATE_START";
export const DEPLOYMENT_CREATE_SUCCESS = "DEPLOYMENT_CREATE_SUCCESS";
export const DEPLOYMENT_CREATE_ERROR = "DEPLOYMENT_CREATE_ERROR";

export function createDeployment (environmentName, lambdaName) {
    const settings = store.getState().settings;
    return async dispatch => {
        try {
            dispatch({type: DEPLOYMENT_CREATE_START});
            await axios.post(`${settings.backendEndpoint}/deployments`, {
                awsRegion: settings.awsRegion,
                awsAccessKeyId: settings.awsAccessKeyId,
                awsSecretAccessKey: settings.awsSecretAccessKey,
                environmentName: environmentName,
                lambdaName: lambdaName
            });
            dispatch({type: DEPLOYMENT_CREATE_SUCCESS});
        } catch (error) {
            dispatch({
                type: DEPLOYMENT_CREATE_ERROR,
                payload: error,
                error: true
            });
        }
    };
}
