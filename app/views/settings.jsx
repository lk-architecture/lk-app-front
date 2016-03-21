import React, {Component} from "react";
import {Input} from "react-bootstrap";
import {connect} from "react-redux";

class Settings extends Component {

    render () {
        return (
            <div>
                <h2>
                    {"Settings"}
                </h2>
                <hr />
                <Input
                    label="S3 bucket"
                    placeholder="lambdas"
                    type="text"
                />
            </div>
        );
    }

}

export default connect()(Settings);
