import React, {Component} from "react";
import {Button, Input} from "react-bootstrap";
import {connect} from "react-redux";

// import Icon from "components/icon";
// import history from "lib/history";

class CreateEnvironment extends Component {

    static propTypes = {
    }

    constructor () {
        super();
        this.state = {
            environmentName: ""
        };
    }

    handleChange (event) {
        this.setState({
            environmentName: event.target.value
        });
    }

    addEnvironment () {
        console.log(`Add environment ${this.state.environmentName}`);
    }

    render () {
        return (
            <div>
                <Input
                    onChange={::this.handleChange}
                    placeholder="Environment name"
                    type="text"
                    value={this.state.environmentName}
                />
                <Button onClick={::this.addEnvironment}>
                    {"Create"}
                </Button>
            </div>
        );
    }

}

export default connect()(CreateEnvironment);
