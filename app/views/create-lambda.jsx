import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import CreateLambaForm from "components/create-lamba-form";
import {upsertLambda} from "actions/lambdas";

class CreateLambda extends Component {

    static propTypes = {
        environmentName: PropTypes.string,
        lambda: PropTypes.string,
        upsertLambda: PropTypes.func.isRequired
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    render () {
        return (
            <CreateLambaForm onSubmit={::this.handleSubmit} />
        );
    }
}

function mapStateToProps (state, props) {
    return {
        environmentName: props.params.environmentName
    };
}
function mapDispatchToProps (dispatch) {
    return {
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLambda);
