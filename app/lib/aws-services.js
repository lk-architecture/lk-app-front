import {promisifyAll} from "bluebird";

import store from "lib/store";

function getAWSSettingsFor (service) {
    const settings = store.getState().settings;
    return {
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey,
        region: settings.awsRegion,
        endpoint: settings[`${service}Endpoint`]
    };
}

export function getDynamodb () {
    const dynamodb = new AWS.DynamoDB.DocumentClient(getAWSSettingsFor("dynamodb"));
    return promisifyAll(dynamodb);
}

export function getKinesis () {
    const kinesis = new AWS.Kinesis(getAWSSettingsFor("kinesis"));
    return promisifyAll(kinesis);
}

export function getS3 () {
    const s3 = new AWS.S3(getAWSSettingsFor("s3"));
    return promisifyAll(s3);
}
