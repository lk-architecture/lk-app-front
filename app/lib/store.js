import {applyMiddleware, compose, createStore} from "redux";
import logger from "redux-logger";
import {persistStore, autoRehydrate} from "redux-persist";
import thunk from "redux-thunk";

import rootReducer from "reducers";

const middleware = applyMiddleware(
    thunk,
    logger({collapsed: true})
);

const store = compose(
    middleware
)(createStore)(rootReducer, {}, autoRehydrate());

persistStore(store, {
    whitelist: ["settings"]
});

export default store;
