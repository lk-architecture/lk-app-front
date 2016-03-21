import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {reduxForm} from "redux-form";

class SettingsForm extends Component {

    static propTypes = {
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    render () {
        const {fields, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Input
                    label="AWS Access Key Id"
                    placeholder="AWS_ACCESS_KEY_ID"
                    type="text"
                    {...fields.awsAccessKeyId}
                />
                <Input
                    label="AWS Secret Access Key"
                    placeholder="AWS_SECRET_ACCESS_KEY"
                    type="text"
                    {...fields.awsSecretAccessKey}
                />
                <Input
                    label="AWS Region"
                    placeholder="us-west-1"
                    type="text"
                    {...fields.awsRegion}
                />
                <Input
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
    ]
})(SettingsForm);
