import axios from "axios";

import * as config from "config";
import store from "lib/store";
import {getDynamodb} from "lib/aws-services";
import {map} from "bluebird";

export const LAMBDA_UPDATE_START = "LAMBDA_UPDATE_START";
export const LAMBDA_CREATE_SUCCESS = "LAMBDA_CREATE_SUCCESS";
export const LAMBDA_DELETE_SUCCESS = "LAMBDA_DELETE_SUCCESS";
export const LAMBDA_UPDATE_ERROR = "LAMBDA_UPDATE_ERROR";

export function createDeployment (environmentName, lambdaName, version) {
    console.log("Start createDeployment");
    console.log(lambdaName);
    const settings = store.getState().settings;
    return async dispatch => {
        try {
            dispatch({type: LAMBDA_UPDATE_START});
            await axios.post(`${settings.backendEndpoint}/deployments`, {
                awsRegion: settings.awsRegion,
                awsAccessKeyId: settings.awsAccessKeyId,
                awsSecretAccessKey: settings.awsSecretAccessKey,
                environmentName: environmentName,
                lambdaName: lambdaName,
                version: version
            });

            const dynamodb = getDynamodb();
            const result = await dynamodb.scanAsync({
                TableName: config.DYNAMODB_DEPLOYMENTS_TABLE
            });

            dispatch({
                type: LAMBDA_CREATE_SUCCESS,
                payload: result.Items
            });
        } catch (error) {
            dispatch({
                type: LAMBDA_UPDATE_ERROR,
                payload: error,
                error: true
            });
        }
    };
}

export function clearDeploy (environmentName, deploymentsCollection) {
    return async dispatch => {
        try {
            dispatch({type: LAMBDA_UPDATE_START});
            const dynamodb = getDynamodb();
            await map(deploymentsCollection, async (element) => {
                await dynamodb.deleteAsync({
                    TableName: config.DYNAMODB_DEPLOYMENTS_TABLE,
                    Key: {
                        id: element.id,
                        environmentName: environmentName
                    }
                });
            });
            dispatch({
                type: LAMBDA_DELETE_SUCCESS,
                payload: []
            });
        } catch (error) {
            dispatch({
                type: LAMBDA_UPDATE_ERROR,
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
