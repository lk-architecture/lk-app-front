export const NODE_ENV = ("development");

const BASE_TABLE_NAME = "lk-deploy";
export const DYNAMODB_ENVIRONMENTS_TABLE = `${BASE_TABLE_NAME}-environments`;
export const DYNAMODB_LAMBDAS_TABLE = `${BASE_TABLE_NAME}-lambdas`;
export const DYNAMODB_DEPLOYMENTS_TABLE = `${BASE_TABLE_NAME}-deployments`;
