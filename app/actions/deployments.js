import axios from "axios";

import * as config from "config";
import store from "lib/store";
import {getDynamodb} from "lib/aws-services";

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

            const dynamodb = getDynamodb();
            const result = await dynamodb.scanAsync({
                TableName: config.DYNAMODB_DEPLOYMENTS_TABLE
            });

            dispatch({
                type: DEPLOYMENT_CREATE_SUCCESS,
                payload: result.Items
            });
        } catch (error) {
            dispatch({
                type: DEPLOYMENT_CREATE_ERROR,
                payload: error,
                error: true
            });
        }
    };
}

export const DEPLOYMENTS_LIST_START = "DEPLOYMENTS_LIST_START";
export const DEPLOYMENTS_LIST_SUCCESS = "DEPLOYMENTS_LIST_SUCCESS";
export const DEPLOYMENTS_LIST_ERROR = "DEPLOYMENTS_LIST_ERROR";

export function listDeployments () {
    return async dispatch => {
        try {
            const dynamodb = getDynamodb();
            dispatch({type: DEPLOYMENTS_LIST_START});
            const result = await dynamodb.scanAsync({
                TableName: config.DYNAMODB_DEPLOYMENTS_TABLE
            });
            dispatch({
                type: DEPLOYMENTS_LIST_SUCCESS,
                payload: result.Items
            });
        } catch (error) {
            dispatch({
                type: DEPLOYMENTS_LIST_ERROR,
                payload: error,
                error: true
            });
        }
    };
}
