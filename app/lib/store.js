import {applyMiddleware, compose, createStore} from "redux";
import {persistStore, autoRehydrate} from "redux-persist";
import createLogger from "redux-logger";

import safeDispatchThunk from "lib/safe-dispatch-thunk";
import rootReducer from "reducers";

const middlewares = [safeDispatchThunk];

if (process.env.NODE_ENV !== "test") {
    middlewares.push(createLogger({collapsed: true}));
}

const store = compose(
    applyMiddleware(...middlewares)
)(createStore)(rootReducer, {}, autoRehydrate());

persistStore(store, {
    whitelist: ["settings"],
    keyPrefix: "lk-app-front:"
});

export default store;
