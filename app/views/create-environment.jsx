import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Breadcrumb} from "react-bootstrap";

import {createEnvironment} from "actions/environments";
import CreateEnvironmentForm from "components/create-environment-form";
import StepsProgressIndicator from "components/steps-progress-indicator";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";

class CreateEnvironment extends Component {

    static propTypes = {
        createEnvironment: PropTypes.func.isRequired,
        environmentCreation: AppPropTypes.environmentCreation
    }

    handleSubmit ({name}) {
        this.props.createEnvironment(name);
    }

    render () {
        return (
            <div>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => history.push("/")}>
                            {"Home"}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active={true}>
                          {"Create Environment"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <CreateEnvironmentForm disabled={!this.props.environmentCreation.completed} onSubmit={::this.handleSubmit} />
                    <hr />
                    <StepsProgressIndicator steps={this.props.environmentCreation.steps} />
                </div>
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
