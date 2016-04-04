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

class CreateLambaForm extends Component {

    static propTypes = {
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    constructor () {
        super();
        this.state = {
            kvPair: []
        };
    }

    getFieldBsStyle (field) {
        return (field.touched && field.error ? "error" : null);
    }

    getFieldHelp (field) {
        return (field.touched && field.error);
    }

    onChangeKeyValuePair (event) {
        this.setState({
            kvPair: event
        });
    }

    render () {
        const {fields, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Input
                    bsStyle={this.getFieldBsStyle(fields.name)}
                    help={this.getFieldHelp(fields.name)}
                    label="Name"
                    placeholder="lambda-my-name"
                    type="text"
                    {...fields.name}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.gitUrl)}
                    help={this.getFieldHelp(fields.gitUrl)}
                    label="Git URL"
                    placeholder="https://github.com/example/lambda11.git"
                    type="text"
                    {...fields.gitUrl}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.gitBranch)}
                    help={this.getFieldHelp(fields.gitBranch)}
                    label="Git branch"
                    placeholder="master"
                    type="text"
                    {...fields.gitBranch}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.role)}
                    help={this.getFieldHelp(fields.role)}
                    label="AWS role"
                    placeholder="lambda_basic_execution"
                    type="text"
                    {...fields.role}
                />
                <p>{"Environment variables"}</p>
                <KVInput
                    bsStyle={this.getFieldBsStyle(fields.environmentVariables)}
                    help={this.getFieldHelp(fields.environmentVariables)}
                    onChange={::this.onChangeKeyValuePair}
                    value={this.state.kvPair}
                    {...fields.environmentVariables}
                />
                <hr />
                <Button type="submit">
                    {"Save"}
                </Button>
            </form>
        );
    }

}

export default reduxForm({
    form: "lambda",
    fields: [
        "name",
        "gitUrl",
        "gitBranch",
        "role",
        "environmentVariables"
    ],
    validate: validate
})(CreateLambaForm);
