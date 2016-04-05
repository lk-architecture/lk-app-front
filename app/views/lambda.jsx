import {find} from "lodash";
import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {listEnvironments} from "actions/environments";
import {createDeployment} from "actions/deployments";
import {listLambdas, upsertLambda} from "actions/lambdas";
import UpsertLambdaForm from "components/upsert-lambda-form";
import * as AppPropTypes from "lib/app-prop-types";

class Lambda extends Component {

    static propTypes = {
        createDeployment: PropTypes.func.isRequired,
        environmentName: PropTypes.string.isRequired,
        lambda: AppPropTypes.lambda,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired,
        upsertLambda: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listEnvironments();
        this.props.listLambdas();
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    deploy () {
        const {createDeployment, environmentName, lambda} = this.props;
        createDeployment(environmentName, lambda.name);
    }

    render () {
        const {lambda} = this.props;
        return lambda ? (
            <div>
                <UpsertLambdaForm
                    initialValues={{
                        name: lambda.name,
                        githubOrg: lambda.github.org,
                        githubRepo: lambda.github.repo,
                        environmentVariables: lambda.environmentVariables,
                        role: lambda.role
                    }}
                    onSubmit={::this.handleSubmit}
                />
                <h3>{"Deployment"}</h3>
                <Button onClick={::this.deploy}>
                    {"Deploy"}
                </Button>
            </div>
        ) : null;
    }

}

function mapStateToProps (state, props) {
    return {
        environmentName: props.params.environmentName,
        lambda: find(state.lambdas.collection, lambda => (
            lambda.environmentName === props.params.environmentName &&
            lambda.name === props.params.lambdaName
        ))
    };
}
function mapDispatchToProps (dispatch) {
    return {
        createDeployment: bindActionCreators(createDeployment, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
