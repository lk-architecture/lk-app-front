import {map} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {reduxForm} from "redux-form";

function validate (values) {
    return map(value => (
        typeof value === "string" && value.length > 0 ? null : "Required"
    ), values);
}

class SettingsForm extends Component {

    static propTypes = {
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    getFieldBsStyle (field) {
        return (field.touched && field.error ? "error" : null);
    }

    render () {
        const {fields, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Input
                    bsStyle={this.getFieldBsStyle(fields.awsAccessKeyId)}
                    help={fields.awsAccessKeyId.error}
                    label="AWS Access Key Id"
                    placeholder="AWS_ACCESS_KEY_ID"
                    type="text"
                    {...fields.awsAccessKeyId}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.awsSecretAccessKey)}
                    help={fields.awsSecretAccessKey.error}
                    label="AWS Secret Access Key"
                    placeholder="AWS_SECRET_ACCESS_KEY"
                    type="text"
                    {...fields.awsSecretAccessKey}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.awsRegion)}
                    help={fields.awsRegion.error}
                    label="AWS Region"
                    placeholder="us-west-1"
                    type="text"
                    {...fields.awsRegion}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.dynamodbTablesBaseName)}
                    help={fields.dynamodbTablesBaseName.error}
                    label="DynamoDB Tables Base Name"
                    placeholder="lk-deploy"
                    type="text"
                    {...fields.dynamodbTablesBaseName}
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
        "awsAccessKeyId",
        "awsSecretAccessKey",
        "awsRegion",
        "dynamodbTablesBaseName"
    ],
    validate: validate
})(SettingsForm);
