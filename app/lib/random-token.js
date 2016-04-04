import {v4} from "node-uuid";

export default function randomToken () {
    return v4().slice(0, 8);
}
