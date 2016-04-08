import {map} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import {reduxForm} from "redux-form";

import KVInput from "components/kv-input";
import Spacer from "components/spacer";

function validate (values) {
    return map((value) => {
        return (value != undefined && value.length > 0) ? null : "Required";
    }, values);
}

class CreateEnvironmentVariablesForm extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    getFieldBsStyle (field) {
        return (field.touched && field.error ? "error" : null);
    }

    getFieldHelp (field) {
        return (field.touched && field.error);
    }

    render () {
        const {disabled, fields, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <KVInput
                    bsStyle={this.getFieldBsStyle(fields.environmentVariables)}
                    help={this.getFieldHelp(fields.environmentVariables)}
                    {...fields.environmentVariables}
                />
                <Spacer direction={"v"} size={10} />
                <Button disabled={disabled} type="submit">
                    {"Save global variables"}
                </Button>
            </form>
        );
    }
}

export default reduxForm({
    form: "globalVariables",
    fields: ["environmentVariables"],
    validate: validate
})(CreateEnvironmentVariablesForm);
