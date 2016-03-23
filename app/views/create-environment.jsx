import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {createEnvironment} from "actions/environments";
import CreateEnvironmentForm from "components/create-environment-form";

class CreateEnvironment extends Component {

    static propTypes = {
        createEnvironment: PropTypes.func.isRequired
    }

    handleSubmit ({name, region}) {
        this.props.createEnvironment(name, region);
    }

    render () {
        return (
            <div>
                <CreateEnvironmentForm onSubmit={::this.handleSubmit} />
            </div>
        );
    }

}

function mapDispatchToProps (dispatch) {
    return {
        createEnvironment: bindActionCreators(createEnvironment, dispatch)
    };
}
export default connect(null, mapDispatchToProps)(CreateEnvironment);
