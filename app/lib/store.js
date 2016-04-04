import {applyMiddleware, compose, createStore} from "redux";
import logger from "redux-logger";
import {persistStore, autoRehydrate} from "redux-persist";

import safeDispatchThunk from "lib/safe-dispatch-thunk";
import rootReducer from "reducers";

const middleware = applyMiddleware(
    safeDispatchThunk,
    logger({collapsed: true})
);

const store = compose(
    middleware
)(createStore)(rootReducer, {}, autoRehydrate());

persistStore(store, {
    whitelist: ["settings"]
});

export default store;
