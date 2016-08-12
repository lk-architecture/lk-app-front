import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Breadcrumb} from "react-bootstrap";

import UpsertLambdaForm from "components/upsert-lambda-form";
import {upsertLambda} from "actions/lambdas";
import history from "lib/history";

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
            <div>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => history.push("/")}>
                            {"Home"}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => history.push(`/environments/${this.props.environmentName}`)}>
                            {this.props.environmentName}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active={true}>
                          {"Add Lambda"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <UpsertLambdaForm disabled={!this.props.lambdaCreation.completed} onSubmit={::this.handleSubmit} />
                </div>
            </div>
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
