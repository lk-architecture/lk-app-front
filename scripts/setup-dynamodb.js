import {promisifyAll} from "bluebird";
import {DynamoDB} from "aws-sdk";

const dynamodb = new DynamoDB({
    apiVersion: "2012-08-10",
    endpoint: "http://localhost:8000",
    region: "us-west-1",
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey"
});
promisifyAll(dynamodb);

export default function setupDynamodb () {
    return dynamodb.createTableAsync({
        AttributeDefinitions: [{
            AttributeName: "id",
            AttributeType: "S"
        }],
        KeySchema: [{
            AttributeName: "id",
            KeyType: "HASH"
        }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
        TableName: "lk-deploy-environments"
    });
}
