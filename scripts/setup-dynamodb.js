import {promisifyAll} from "bluebird";
import {DynamoDB} from "aws-sdk";

const dynamodb = new DynamoDB({
    apiVersion: "2012-08-10",
    endpoint: "http://localhost:8000",
    region: "us-east-1",
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey"
});
promisifyAll(dynamodb);

export default async function setupDynamodb () {
    await dynamodb.createTableAsync({
        AttributeDefinitions: [{
            AttributeName: "name",
            AttributeType: "S"
        }],
        KeySchema: [{
            AttributeName: "name",
            KeyType: "HASH"
        }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
        TableName: "lk-environments"
    });
    console.log("Created lk-environments table");
    await dynamodb.createTableAsync({
        AttributeDefinitions: [
            {
                AttributeName: "environmentName",
                AttributeType: "S"
            },
            {
                AttributeName: "name",
                AttributeType: "S"
            }
        ],
        KeySchema: [
            {
                AttributeName: "environmentName",
                KeyType: "HASH"
            },
            {
                AttributeName: "name",
                KeyType: "RANGE"
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
        TableName: "lk-lambdas"
    });
    console.log("Created lk-lambdas table");
    await dynamodb.createTableAsync({
        AttributeDefinitions: [
            {
                AttributeName: "environmentName",
                AttributeType: "S"
            },
            {
                AttributeName: "id",
                AttributeType: "S"
            }
        ],
        KeySchema: [
            {
                AttributeName: "environmentName",
                KeyType: "HASH"
            },
            {
                AttributeName: "id",
                KeyType: "RANGE"
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
        TableName: "lk-deployments"
    });
    console.log("Created lk-deployments table");
}
