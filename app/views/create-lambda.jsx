import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";

// import Icon from "components/icon";
// import history from "lib/history";

class CreateLambda extends Component {

    static propTypes = {
    }

    addLambda () {
        console.log("Add lambda");
    }

    render () {
        return (
            <div>
                <Button onClick={::this.addLambda}>
                    {"Create"}
                </Button>
            </div>
        );
    }

}

export default connect()(CreateLambda);
