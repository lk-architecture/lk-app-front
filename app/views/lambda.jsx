import {find} from "lodash";
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {listEnvironments} from "actions/environments";
import {listLambdas, upsertLambda} from "actions/lambdas";
import CreateLambaForm from "components/create-lamba-form";

class Lambda extends Component {

    static propTypes = {
        environmentName: PropTypes.string.isRequired,
        lambda: PropTypes.any,
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

    render () {
        const {lambda} = this.props;
        return lambda ? (
            <div>
                <CreateLambaForm
                    initialValues={{
                        name: lambda.name,
                        gitUrl: lambda.defaultConfiguration.git.url,
                        gitBranch: lambda.defaultConfiguration.git.branch,
                        environmentVariables: lambda.defaultConfiguration.environmentVariables,
                        role: lambda.defaultConfiguration.role
                    }}
                    onSubmit={::this.handleSubmit}
                />
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
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
