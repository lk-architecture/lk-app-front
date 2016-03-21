import React, {Component, PropTypes} from "react";
import {Button, Input, Modal} from "react-bootstrap";

export default class LoginModal extends Component {

    static propTypes = {
        onLogin: PropTypes.func.isRequired
    }

    handleLogin () {
        this.props.onLogin(
            this.refs.accessKeyId.getValue(),
            this.refs.secretAccessKey.getValue()
        );
    }

    render () {
        return (
            <div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>{"Login"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Input
                            label="AWS Access Key Id"
                            placeholder="AWS_ACCESS_KEY_ID"
                            ref="accessKeyId"
                            type="text"
                        />
                        <Input
                            label="AWS Secret Access Key"
                            placeholder="AWS_SECRET_ACCESS_KEY"
                            ref="secretAccessKey"
                            type="text"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={::this.handleLogin}>{"Login"}</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}
