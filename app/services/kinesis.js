import {promisifyAll} from "bluebird";

export default function getKinesis (settings) {
    const kinesis = new AWS.Kinesis(settings);
    return promisifyAll(kinesis);
}
