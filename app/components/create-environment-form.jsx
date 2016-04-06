import {map} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {reduxForm} from "redux-form";

function validate (values) {
    return map(value => (
        typeof value === "string" && value.length > 0 ? null : "Required"
    ), values);
}

class CreateEnvironmentForm extends Component {

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
                <Input
                    bsStyle={this.getFieldBsStyle(fields.name)}
                    help={this.getFieldHelp(fields.name)}
                    label="Name"
                    placeholder="Environment name"
                    type="text"
                    {...fields.name}
                />
                <Button type="submit" disabled={disabled}>
                    {"Save"}
                </Button>
            </form>
        );
    }
}

export default reduxForm({
    form: "settings",
    fields: ["name"],
    validate: validate
})(CreateEnvironmentForm);
