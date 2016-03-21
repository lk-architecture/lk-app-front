import {REHYDRATE} from "redux-persist/constants";

export default function hasRehydrated (state = false, action) {
    return action.type === REHYDRATE ? true : state;
}
