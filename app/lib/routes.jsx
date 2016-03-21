import React from "react";
import {IndexRoute, Route, Router} from "react-router";

import history from "lib/history";
import Environments from "views/environments";
import CreateEnvironment from "views/create-environment";
import Environment from "views/environment";
import CreateLambda from "views/create-lambda";
import Lambda from "views/lambda";
import Settings from "views/settings";
import Root from "views/root";

export default (
    <Router history={history}>
        <Route component={Root} path="/">
            <IndexRoute component={Environments} />
            <Route component={Environments} path="/environments" />
            <Route component={CreateEnvironment} path="/environments/new" />
            <Route component={Environment} path="/environments/:environmentName" />
            <Route component={CreateLambda} path="/environments/:environmentName/lambda/new" />
            <Route component={Lambda} path="/environments/:environmentName/lambda/:lambdaName" />
            <Route component={Settings} path="/settings" />
        </Route>
    </Router>
);
