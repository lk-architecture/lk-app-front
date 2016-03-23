import React, {Component} from "react";
import {Input} from "react-bootstrap";

const regions = [
    "us-east-1",
    "us-west-2",
    "us-west-1",
    "eu-west-1",
    "eu-central-1",
    "ap-southeast-1",
    "ap-northeast-1",
    "ap-southeast-2",
    "ap-northeast-2",
    "sa-east-1"
];

export default class AWSRegionSelect extends Component {

    render () {
        return (
            <Input {...this.props} label="AWS Region" type="select">
                <option value={undefined}></option>
                {regions.map(region => (
                    <option key={region} value={region}>
                        {region}
                    </option>
                ))}
            </Input>
        );
    }

}
