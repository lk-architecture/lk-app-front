import {applyMiddleware, compose, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "reducers";

const middleware = applyMiddleware(
    thunk,
    logger({collapsed: true})
);

export default compose(
    middleware
)(createStore)(rootReducer);
