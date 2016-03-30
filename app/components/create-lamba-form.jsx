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
                <p>{"Environment configurations"}</p>
                <KVInput
                    bsStyle={this.getFieldBsStyle(fields.environment)}
                    help={this.getFieldHelp(fields.environment)}
                    onChange={::this.onChangeKeyValuePair}
                    value={this.state.kvPair}
                    {...fields.environment}
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
        "gitUrl",
        "gitBranch",
        "environment",
        "name"
    ],
    validate: validate
})(CreateLambaForm);
