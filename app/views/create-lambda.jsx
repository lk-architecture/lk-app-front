import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Alert, Breadcrumb} from "react-bootstrap";

import UpsertLambdaForm from "components/upsert-lambda-form";
import {upsertLambda, upsertLambdaReset} from "actions/lambdas";
import history from "lib/history";

class CreateLambda extends Component {

    static propTypes = {
        environmentName: PropTypes.string,
        lambdaCreation: PropTypes.shape({
            fetching : PropTypes.bool,
            error: PropTypes.string,
            upsertLambda: PropTypes.object,
        }),
        upsertLambda: PropTypes.func.isRequired,
        upsertLambdaReset: PropTypes.func.isRequired
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    renderAlert (error) {
        return (error ?
            <Alert bsStyle="danger" >
                <strong>{error.code+": "}</strong>{error.message}
            </Alert>
        : null);
    }

    render () {
        const {fetching, error, upsertLambda} = this.props.lambdaCreation;
        if (upsertLambda && upsertLambda.name && upsertLambda.environmentName) {
            history.push(`/environments/${upsertLambda.environmentName}/lambda/${upsertLambda.name}`);
            this.props.upsertLambdaReset();
        }
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
                {this.renderAlert(error)}
                <div>
                    <UpsertLambdaForm disabled={fetching} onSubmit={::this.handleSubmit} />
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
        upsertLambda: bindActionCreators(upsertLambda, dispatch),
        upsertLambdaReset: bindActionCreators(upsertLambdaReset, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLambda);
