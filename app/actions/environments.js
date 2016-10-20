import axios from "axios";

import * as config from "config";
import {getDynamodb, getKinesis} from "lib/aws-services";
import store from "lib/store";
import randomToken from "lib/random-token";

export const ENVIRONMENTS_LIST_START = "ENVIRONMENTS_LIST_START";
export const ENVIRONMENTS_LIST_SUCCESS = "ENVIRONMENTS_LIST_SUCCESS";
export const ENVIRONMENTS_LIST_ERROR = "ENVIRONMENTS_LIST_ERROR";
export const ENVIRONMENT_CREATE_RESET = "ENVIRONMENT_CREATE_RESET";

export function listEnvironments () {
    return async dispatch => {
        try {
            const dynamodb = getDynamodb();
            dispatch({type: ENVIRONMENTS_LIST_START});
            const result = await dynamodb.scanAsync({
                TableName: config.DYNAMODB_ENVIRONMENTS_TABLE
            });
            dispatch({
                type: ENVIRONMENTS_LIST_SUCCESS,
                payload: result.Items
            });
        } catch (error) {
            dispatch({
                type: ENVIRONMENTS_LIST_ERROR,
                payload: error,
                error: true
            });
        }
    };
}

export const ENVIRONMENT_CREATE_START = "ENVIRONMENT_CREATE_START";
export const ENVIRONMENT_CREATE_PROGRESS = "ENVIRONMENT_CREATE_PROGRESS";
export const ENVIRONMENT_CREATE_SUCCESS = "ENVIRONMENT_CREATE_SUCCESS";
export const ENVIRONMENT_CREATE_ERROR = "ENVIRONMENT_CREATE_ERROR";

export function createEnvironment (name) {
    return async dispatch => {
        var step = 0;
        try {
            const settings = store.getState().settings;
            const dynamodb = getDynamodb();
            const kinesis = getKinesis();
            dispatch({
                type: ENVIRONMENT_CREATE_START,
                payload: [
                    {
                        id: 0,
                        environmentName: name,
                        label: "Create events S3 bucket",
                        completed: false
                    },
                    {
                        id: 1,
                        environmentName: name,
                        label: "Create kinesis stream",
                        completed: false
                    },
                    {
                        id: 2,
                        environmentName: name,
                        label: "Save environment to DynamoDB",
                        completed: false
                    }
                ]
            });
            const environment = {
                name: name,
                services: {
                    s3: {
                        eventsBucket: `lk-events-${name}-${randomToken()}`
                    },
                    kinesis: {
                        streamName: `lk-${name}`,
                        shardsNumber: 1
                    }
                }
            };
            await axios.post(`${settings.backendEndpoint}/buckets`, {
                awsRegion: settings.awsRegion,
                awsAccessKeyId: settings.awsAccessKeyId,
                awsSecretAccessKey: settings.awsSecretAccessKey,
                s3bucketName: environment.services.s3.eventsBucket
            });
            step=1;
            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 0
            });
            await kinesis.createStreamAsync({
                ShardCount: 1,
                StreamName: environment.services.kinesis.streamName
            });
            step=2;
            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 1
            });
            await dynamodb.putAsync({
                TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
                Item: environment
            });

            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 2
            });
            dispatch({
                type: ENVIRONMENT_CREATE_SUCCESS,
                payload: environment
            });
        } catch (error) {
            dispatch({
                type: ENVIRONMENT_CREATE_ERROR,
                payload: error,
                errorStep: step,
                error: true
            });
        }
    };
}

export function createEnvironmentReset () {
    return {type: ENVIRONMENT_CREATE_RESET};
}
