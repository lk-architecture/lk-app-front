import * as config from "config";
import store from "lib/store";
import getDynamodb from "services/dynamodb";

export const ENVIRONMENTS_LIST_START = "ENVIRONMENTS_LIST_START";
export const ENVIRONMENTS_LIST_SUCCESS = "ENVIRONMENTS_LIST_SUCCESS";
export const ENVIRONMENTS_LIST_ERROR = "ENVIRONMENTS_LIST_ERROR";

export function listEnvironments () {
    const settings = store.getState().settings;
    const dynamodb = getDynamodb({
        endpoint: settings.dynamodbEndpoint,
        region: settings.awsRegion,
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey
    });
    return async dispatch => {
        dispatch({type: ENVIRONMENTS_LIST_START});
        var result;
        try {
            result = await dynamodb.scanAsync({
                TableName: config.DYNAMODB_ENVIRONMENTS_TABLE
            });
        } catch (error) {
            // We're only interested in catching errors of the queryAsync call,
            // not those that might get thrown by the dispatch call.
            dispatch({
                type: ENVIRONMENTS_LIST_ERROR,
                payload: error,
                error: true
            });
            return;
        }
        dispatch({
            type: ENVIRONMENTS_LIST_SUCCESS,
            payload: result.Items
        });
    };
}

export const ENVIRONMENT_CREATE_START = "ENVIRONMENT_CREATE_START";
export const ENVIRONMENT_CREATE_PROGRESS = "ENVIRONMENT_CREATE_PROGRESS";
export const ENVIRONMENT_CREATE_SUCCESS = "ENVIRONMENT_CREATE_SUCCESS";
export const ENVIRONMENT_CREATE_ERROR = "ENVIRONMENT_CREATE_ERROR";

export function createEnvironment (name, region) {
    const settings = store.getState().settings;
    const dynamodb = getDynamodb({
        endpoint: settings.dynamodbEndpoint,
        region: settings.awsRegion,
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey
    });
    return async dispatch => {
        dispatch({type: ENVIRONMENT_CREATE_START});
        const environment = {
            id: name,
            name: name,
            region: region,
            services: {
                s3: {
                    eventsBucket: `lk-events-bucket-${name}`,
                    lambdasBucket: `lk-lambdas-bucket-${name}`
                },
                kinesis: {
                    streamName: `lk-kinesis-stream-${name}`,
                    shardsNumber: 1
                },
                lambda: {
                    lambdas: []
                }
            }
        };
        try {
            await dynamodb.putAsync({
                TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
                Item: environment
            });
        } catch (error) {
            // We're only interested in catching errors of the putAsync call,
            // not those that might get thrown by the dispatch call.
            dispatch({
                type: ENVIRONMENT_CREATE_ERROR,
                payload: error,
                error: true
            });
            return;
        }
        dispatch({
            type: ENVIRONMENT_CREATE_SUCCESS,
            payload: environment
        });
    };
}
