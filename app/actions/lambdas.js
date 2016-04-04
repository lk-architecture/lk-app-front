import * as config from "config";

import {getDynamodb} from "lib/aws-services";

export const LAMBDAS_LIST_START = "LAMBDAS_LIST_START";
export const LAMBDAS_LIST_SUCCESS = "LAMBDAS_LIST_SUCCESS";
export const LAMBDAS_LIST_ERROR = "LAMBDAS_LIST_ERROR";

export function listLambdas () {
    return async dispatch => {
        try {
            const dynamodb = getDynamodb();
            dispatch({type: LAMBDAS_LIST_START});
            const result = await dynamodb.scanAsync({
                TableName: config.DYNAMODB_LAMBDAS_TABLE
            });
            dispatch({
                type: LAMBDAS_LIST_SUCCESS,
                payload: result.Items
            });
        } catch (error) {
            dispatch({
                type: LAMBDAS_LIST_ERROR,
                payload: error,
                error: true
            });
        }
    };
}

export const LAMBDA_UPSERT_START = "LAMBDA_UPSERT_START";
export const LAMBDA_UPSERT_SUCCESS = "LAMBDA_UPSERT_SUCCESS";
export const LAMBDA_UPSERT_ERROR = "LAMBDA_UPSERT_ERROR";

export function upsertLambda (environmentName, lambdaConfiguration) {
    return async dispatch => {
        try {
            const dynamodb = getDynamodb();
            const lambda = {
                name: lambdaConfiguration.name,
                environmentName: environmentName,
                defaultConfiguration: {
                    environmentVariables: lambdaConfiguration.environmentVariables,
                    git: {
                        url: lambdaConfiguration.gitUrl,
                        branch: lambdaConfiguration.gitBranch
                    },
                    role: lambdaConfiguration.role
                }
            };
            dispatch({type: LAMBDA_UPSERT_START});
            await dynamodb.putAsync({
                TableName: config.DYNAMODB_LAMBDAS_TABLE,
                Item: lambda
            });
            dispatch({
                type: LAMBDA_UPSERT_SUCCESS,
                payload: lambda
            });
        } catch (error) {
            dispatch({
                type: LAMBDA_UPSERT_ERROR,
                payload: error,
                error: true
            });
        }
    };
}
