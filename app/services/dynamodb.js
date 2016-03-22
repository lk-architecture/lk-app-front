import {promisifyAll} from "bluebird";

export default function getDynamodb (settings) {
    const dynamodb = new AWS.DynamoDB.DocumentClient(settings);
    return promisifyAll(dynamodb);
}
