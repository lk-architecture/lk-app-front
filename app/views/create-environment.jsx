import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {createEnvironment} from "actions/environments";
import CreateEnvironmentForm from "components/create-environment-form";
import StepsProgressIndicator from "components/steps-progress-indicator";
import * as AppPropTypes from "lib/app-prop-types";

class CreateEnvironment extends Component {

    static propTypes = {
        createEnvironment: PropTypes.func.isRequired,
        environmentCreation: AppPropTypes.stepList
    }

    handleSubmit ({name}) {
        this.props.createEnvironment(name);
    }

    render () {
        return (
            <div>
                <CreateEnvironmentForm disabled={!this.props.environmentCreation.completed} onSubmit={::this.handleSubmit} />
                <hr />
                <StepsProgressIndicator steps={this.props.environmentCreation.steps} />
            </div>
        );
    }

}

function mapStateToProps (state) {
    return {
        environmentCreation: state.environmentCreation
    };
}

function mapDispatchToProps (dispatch) {
    return {
        createEnvironment: bindActionCreators(createEnvironment, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEnvironment);
