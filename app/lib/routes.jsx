import React from "react";
import {browserHistory, IndexRoute, Route, Router} from "react-router";

import Root from "views/root";
import Home from "views/home";

export default (
    <Router history={browserHistory}>
        <Route component={Root} path="/">
            <IndexRoute component={Home} />
            <Route component={Home} path="/home" />
        </Route>
    </Router>
);
