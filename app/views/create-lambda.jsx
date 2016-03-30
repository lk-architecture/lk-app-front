import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import CreateLambaForm from "components/create-lamba-form";
import {addLambda} from "actions/environments";

class CreateLambda extends Component {

    static propTypes = {
        addLambda: PropTypes.func.isRequired,
        environmentName: PropTypes.string.isRequired,
        lambda: PropTypes.string
    }

    handleSubmit (lambdaInfos) {
        const {environmentName} = this.props;
        this.props.addLambda(environmentName, lambdaInfos);
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
        addLambda: bindActionCreators(addLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLambda);
