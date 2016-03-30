import * as config from "config";
import store from "lib/store";
import getDynamodb from "services/dynamodb";
import getKinesis from "services/kinesis";
import getS3 from "services/s3";

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
    const awsSettings = {
        region: settings.awsRegion,
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey
    };
    const dynamodb = getDynamodb({...awsSettings, endpoint: settings.dynamodbEndpoint});
    const kinesis = getKinesis({...awsSettings, endpoint: settings.kinesisEndpoint});
    const s3 = getS3({...awsSettings, endpoint: settings.s3Endpoint});
    return async dispatch => {
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
            kinesis.createStreamAsync({
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

export const ENVIRONMENT_ADD_LAMBDA = "ENVIRONMENT_ADD_LAMBDA";

export function addLambda (environmentName, lambdaInfos) {
    const settings = store.getState().settings;
    const awsSettings = {
        region: settings.awsRegion,
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey
    };
    const dynamodb = getDynamodb({...awsSettings, endpoint: settings.dynamodbEndpoint});
    return async dispatch => {
        let result = await dynamodb.getAsync({
            TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
            Key: {
                id: environmentName
            }
        });
        let environment = result.Item;
        environment.services.lambda.lambdas = [...environment.services.lambda.lambdas, {
            id: lambdaInfos.name,
            name: lambdaInfos.name,
            defaultConfiguration: {
                environment: lambdaInfos.environment,
                git: {
                    url: lambdaInfos.gitUrl,
                    branch: lambdaInfos.gitBranch
                },
                role: lambdaInfos.role
            }
        }];
        await dynamodb.putAsync({
            TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
            Item: environment
        });
        dispatch({
            type: ENVIRONMENT_ADD_LAMBDA,
            payload: environment
        });
    };
}

export const ENVIRONMENT_REMOVE_LAMBDA = "ENVIRONMENT_REMOVE_LAMBDA";

export function removeLambda (environmentName, lambdaName) {
    const settings = store.getState().settings;
    const awsSettings = {
        region: settings.awsRegion,
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey
    };
    const dynamodb = getDynamodb({...awsSettings, endpoint: settings.dynamodbEndpoint});
    return async dispatch => {
        let result = await dynamodb.getAsync({
            TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
            Key: {
                id: environmentName
            }
        });
        let environment = result.Item;
        environment.services.lambda.lambdas = environment.services.lambda.lambdas.filter((value) => {
            return !(value.name === lambdaName);
        });
        await dynamodb.putAsync({
            TableName: config.DYNAMODB_ENVIRONMENTS_TABLE,
            Item: environment
        });
        dispatch({
            type: ENVIRONMENT_REMOVE_LAMBDA,
            payload: environment
        });
    };
}
