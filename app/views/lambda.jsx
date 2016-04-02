import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import KVInput from "components/kv-input";
import * as AppPropTypes from "lib/app-prop-types";
import {deployLambda} from "actions/environments";

class Lambda extends Component {

    static propTypes = {
        deployLambda: PropTypes.func,
        environment: AppPropTypes.environment,
        lambda: AppPropTypes.lambda
    }

    handleDeployClick () {
        this.props.deployLambda(this.props.environment, this.props.lambda.name);
    }

    render () {
        const {lambda} = this.props;
        return (
            <div>
                <h3>{`Lambda: ${lambda.name}`}</h3>
                <hr />
                <Button onClick={::this.handleDeployClick}>
                    {"Deploy"}
                </Button>
                <Button>
                    {"Delete"}
                </Button>
                <hr />
                <Input
                    label="Git URL"
                    onChange={() => null}
                    placeholder="https://github.com/example/example.git"
                    type="text"
                    value={lambda.defaultConfiguration.git.url}
                />
                <hr />
                <h4>{"Configuration"}</h4>
                <KVInput
                    onChange={() => null}
                    value={lambda.defaultConfiguration.environment}
                />
            </div>
        );
    }

}

function mapStateToProps (state, props) {
    const environment = state.environments.collection[props.params.environmentName];
    return {
        environment: environment,
        lambda: environment.services.lambda.lambdas.find((lambda) => {
            return lambda.name === props.params.lambdaName;
        })
    };
}
function mapDispatchToProps (dispatch) {
    return {
        deployLambda: bindActionCreators(deployLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
