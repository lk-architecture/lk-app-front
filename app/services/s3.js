import {promisifyAll} from "bluebird";

export default function getS3 (settings) {
    const kinesis = new AWS.S3(settings);
    return promisifyAll(kinesis);
}
