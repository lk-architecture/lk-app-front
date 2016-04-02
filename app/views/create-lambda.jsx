import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import CreateLambaForm from "components/create-lamba-form";
import {addLambda} from "actions/environments";
import * as AppPropTypes from "lib/app-prop-types";

class CreateLambda extends Component {

    static propTypes = {
        addLambda: PropTypes.func.isRequired,
        environment: AppPropTypes.environment,
        lambda: PropTypes.string
    }

    handleSubmit (lambdaInfos) {
        this.props.addLambda(this.props.environment, lambdaInfos);
    }

    render () {
        return (
            <CreateLambaForm onSubmit={::this.handleSubmit} />
        );
    }
}

function mapStateToProps (state, props) {
    return {
        environment: state.environments.collection[props.params.environmentName]
    };
}
function mapDispatchToProps (dispatch) {
    return {
        addLambda: bindActionCreators(addLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLambda);
