import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";

import Spacer from "components/spacer";
import * as AppPropTypes from "lib/app-prop-types";

const styles = {
    container: {
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "4px"
    },
    input: {
        flexGrow: 1,
        width: "100px"
    }
};

export default class KVInputEntry extends Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        value: AppPropTypes.kvPair
    }

    handleChange (prop) {
        return event => {
            const {onChange, value} = this.props;
            onChange({
                ...value,
                [prop]: event.target.value
            });
        };
    }

    render () {
        const {onRemove, value} = this.props;
        return (
            <div style={styles.container}>
                <input
                    className="form-control"
                    onChange={this.handleChange("key")}
                    placeholder="Key"
                    style={styles.input}
                    type="text"
                    value={value.key}
                />
                <Spacer direction="h" size={4} />
                <input
                    className="form-control"
                    onChange={this.handleChange("value")}
                    placeholder="Value"
                    style={styles.input}
                    type="text"
                    value={value.value}
                />
                <Spacer direction="h" size={4} />
                <Button onClick={onRemove}>
                    {"Remove"}
                </Button>
            </div>
        );
    }

}
