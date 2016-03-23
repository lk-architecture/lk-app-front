import {map} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {reduxForm} from "redux-form";

import AWSRegionSelect from "components/aws-region-select";

function validate (values) {
    return map(value => (
        typeof value === "string" && value.length > 0 ? null : "Required"
    ), values);
}

class CreateEnvironmentForm extends Component {

    static propTypes = {
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
        const {fields, handleSubmit} = this.props;
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
                <AWSRegionSelect
                    bsStyle={this.getFieldBsStyle(fields.region)}
                    help={this.getFieldHelp(fields.region)}
                    {...fields.region}
                />
                <Button type="submit">
                    {"Save"}
                </Button>
            </form>
        );
    }

}

export default reduxForm({
    form: "settings",
    fields: [
        "name",
        "region"
    ],
    validate: validate
})(CreateEnvironmentForm);
