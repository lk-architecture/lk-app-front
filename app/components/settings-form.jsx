import {map} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Input} from "react-bootstrap";
import {reduxForm} from "redux-form";

import AWSRegionSelect from "components/aws-region-select";
import CollapsibleParagraph from "components/collapsible-paragraph";

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
                <AWSRegionSelect
                    bsStyle={this.getFieldBsStyle(fields.awsRegion)}
                    help={fields.awsRegion.error}
                    {...fields.awsRegion}
                />
                <Input
                    bsStyle={this.getFieldBsStyle(fields.backendEndpoint)}
                    help={fields.backendEndpoint.error}
                    label="Backend endpoint"
                    placeholder="https://api.lk-architecture.org"
                    type="text"
                    {...fields.backendEndpoint}
                />
                <CollapsibleParagraph title="Advanced">
                    <Input
                        bsStyle={this.getFieldBsStyle(fields.dynamodbEndpoint)}
                        help={fields.dynamodbEndpoint.error}
                        label="DynamoDB Endpoint"
                        placeholder="localhost:8000"
                        type="text"
                        {...fields.dynamodbEndpoint}
                    />
                    <Input
                        bsStyle={this.getFieldBsStyle(fields.kinesisEndpoint)}
                        help={fields.kinesisEndpoint.error}
                        label="Kinesis Endpoint"
                        placeholder="localhost:4567"
                        type="text"
                        {...fields.kinesisEndpoint}
                    />
                    <Input
                        bsStyle={this.getFieldBsStyle(fields.s3Endpoint)}
                        help={fields.s3Endpoint.error}
                        label="S3 Endpoint"
                        placeholder="AWS S3 Endpoint"
                        type="text"
                        {...fields.s3Endpoint}
                    />
                </CollapsibleParagraph>
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
        "backendEndpoint",
        "dynamodbEndpoint",
        "kinesisEndpoint",
        "s3Endpoint"
    ],
    validate: validate
})(SettingsForm);
