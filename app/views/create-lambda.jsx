import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import UpsertLambdaForm from "components/upsert-lambda-form";
import {upsertLambda} from "actions/lambdas";

class CreateLambda extends Component {

    static propTypes = {
        environmentName: PropTypes.string,
        lambdaCreation: PropTypes.shape({
            completed : PropTypes.bool,
            error: PropTypes.string
        }),
        upsertLambda: PropTypes.func.isRequired
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    render () {
        return (
            <UpsertLambdaForm disabled={!this.props.lambdaCreation.completed} onSubmit={::this.handleSubmit} />
        );
    }
}

function mapStateToProps (state, props) {
    return {
        lambdaCreation: state.lambdaCreation,
        environmentName: props.params.environmentName
    };
}
function mapDispatchToProps (dispatch) {
    return {
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLambda);
