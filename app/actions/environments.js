import store from "lib/store";
import getDynamodb from "services/dynamodb";

export const ENVIRONMENTS_LIST_START = "ENVIRONMENTS_LIST_START";
export const ENVIRONMENTS_LIST_SUCCESS = "ENVIRONMENTS_LIST_SUCCESS";
export const ENVIRONMENTS_LIST_ERROR = "ENVIRONMENTS_LIST_ERROR";

export function listEnvironments () {
    const settings = store.getState().settings;
    const tableName = `${settings.dynamodbTablesBaseName}-environments`;
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
            result = await dynamodb.scanAsync({TableName: tableName});
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

// export const ENVIRONMENT_CREATE_START = "ENVIRONMENT_CREATE_START";
// export const ENVIRONMENT_CREATE_SUCCESS = "ENVIRONMENT_CREATE_SUCCESS";
// export const ENVIRONMENT_CREATE_ERROR = "ENVIRONMENT_CREATE_ERROR";
//
// export function createEnvironment () {
// }
