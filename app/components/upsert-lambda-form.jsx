import {map} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {reduxForm} from "redux-form";

import KVInput from "components/kv-input";

function validate (values) {
    return map((value) => {
        return (value != undefined && value.length > 0) ? null : "Required";
    }, values);
}

class UpsertLambdaForm extends Component {

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
        const {fields, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Input
                    bsStyle={this.getFieldBsStyle(fields.githubRepo)}
                    help={this.getFieldHelp(fields.githubRepo)}
                    label="Github repo"
                    placeholder="lambda-example"
                    type="text"
                    {...fields.githubRepo}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.githubOrg)}
                    help={this.getFieldHelp(fields.githubOrg)}
                    label="Github organization"
                    placeholder="lk-architecture"
                    type="text"
                    {...fields.githubOrg}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.role)}
                    help={this.getFieldHelp(fields.role)}
                    label="AWS role"
                    placeholder="lambda_basic_execution"
                    type="text"
                    {...fields.role}
                />
                <label>{"Environment variables"}</label>
                <KVInput
                    bsStyle={this.getFieldBsStyle(fields.environmentVariables)}
                    help={this.getFieldHelp(fields.environmentVariables)}
                    {...fields.environmentVariables}
                />
                <hr />
                <Button disabled={this.props.disabled} type="submit">
                    {this.props.disabled ? "Saving" : "Save"}
                </Button>
            </form>
        );
    }
}

export default reduxForm({
    form: "lambda",
    fields: [
        "name",
        "githubOrg",
        "githubRepo",
        "role",
        "environmentVariables"
    ],
    validate: validate
})(UpsertLambdaForm);
