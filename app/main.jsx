import "babel-polyfill";
import "aws-sdk/dist/aws-sdk";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import routes from "lib/routes";
import store from "lib/store";

const App = (
    <Provider store={store}>
        {routes}
    </Provider>
);

ReactDOM.render(App, document.getElementById("root"));
