import * as config from "config";
import {getDynamodb, getKinesis, getS3} from "lib/aws-services";
import randomToken from "lib/random-token";
import store from "lib/store";

export const ENVIRONMENTS_LIST_START = "ENVIRONMENTS_LIST_START";
export const ENVIRONMENTS_LIST_SUCCESS = "ENVIRONMENTS_LIST_SUCCESS";
export const ENVIRONMENTS_LIST_ERROR = "ENVIRONMENTS_LIST_ERROR";

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
        try {
            const dynamodb = getDynamodb();
            const kinesis = getKinesis();
            const s3 = getS3();
            const region = store.getState().settings.awsRegion;
            dispatch({
                type: ENVIRONMENT_CREATE_START,
                payload: [
                    {
                        id: 0,
                        label: "Create events S3 bucket",
                        completed: false
                    },
                    {
                        id: 1,
                        label: "Create lambdas S3 bucket",
                        completed: false
                    },
                    {
                        id: 2,
                        label: "Create kinesis stream",
                        completed: false
                    },
                    {
                        id: 3,
                        label: "Save environment to DynamoDB",
                        completed: false
                    }
                ]
            });
            const environment = {
                name: name,
                region: region,
                services: {
                    s3: {
                        eventsBucket: `lk-events-${name}-${randomToken()}`,
                        lambdasBucket: `lk-lambdas-${name}-${randomToken()}`
                    },
                    kinesis: {
                        streamName: `lk-${name}`,
                        shardsNumber: 1
                    },
                    lambda: {
                        lambdas: []
                    }
                }
            };
            await s3.createBucketAsync({
                Bucket: environment.services.s3.eventsBucket
            });
            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 0
            });
            await s3.createBucketAsync({
                Bucket: environment.services.s3.lambdasBucket
            });
            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 1
            });
            await kinesis.createStreamAsync({
                ShardCount: 1,
                StreamName: environment.services.kinesis.streamName
            });
            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 2
            });
            await dynamodb.putAsync({
                TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
                Item: environment
            });
            dispatch({
                type: ENVIRONMENT_CREATE_PROGRESS,
                payload: 3
            });
            dispatch({
                type: ENVIRONMENT_CREATE_SUCCESS,
                payload: environment
            });
        } catch (error) {
            dispatch({
                type: ENVIRONMENT_CREATE_ERROR,
                payload: error,
                error: true
            });
        }
    };
}
