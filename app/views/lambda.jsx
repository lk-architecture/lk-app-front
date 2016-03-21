import {propEq} from "ramda";
import React, {Component} from "react";
import {Button, Input} from "react-bootstrap";
import {connect} from "react-redux";

import KVInput from "components/kv-input";
import * as AppPropTypes from "lib/app-prop-types";

class Lambda extends Component {

    static propTypes = {
        lambda: AppPropTypes.lambda
    }

    render () {
        const {lambda} = this.props;
        return (
            <div>
                <h3>{`Lambda: ${lambda.name}`}</h3>
                <hr />
                <Button>
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
    const environment = state.environments.find(
        propEq("name", props.params.environmentName)
    );
    return {
        lambda: environment.services.lambda.lambdas.find(
            propEq("name", props.params.lambdaName)
        )
    };
}
export default connect(mapStateToProps)(Lambda);
