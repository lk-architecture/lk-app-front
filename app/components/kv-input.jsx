import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";

import KVInputEntry from "components/kv-input-entry";
import * as AppPropTypes from "lib/app-prop-types";

const styles = {
    container: {
        width: "100%"
    }
};

export default class KVInput extends Component {

    static propTypes = {
        onChange: PropTypes.func,
        value: AppPropTypes.kvPairList
    }

    static defaultProps = {
        value: []
    }

    handleChangeForEntry (index) {
        return kvPair => {
            const {onChange, value} = this.props;
            onChange([
                ...value.slice(0, index),
                kvPair,
                ...value.slice(index + 1)
            ]);
        };
    }

    handleRemoveForEntry (index) {
        return () => {
            const {onChange, value} = this.props;
            onChange([
                ...value.slice(0, index),
                ...value.slice(index + 1)
            ]);
        };
    }

    addEntry () {
        const {onChange, value} = this.props;
        onChange([
            ...value,
            {key: "", value: ""}
        ]);
    }

    render () {
        const {value} = this.props;
        return (
            <div style={styles.container}>
                {value.map((kvPair, index) => (
                    <KVInputEntry
                        key={index}
                        onChange={this.handleChangeForEntry(index)}
                        onRemove={this.handleRemoveForEntry(index)}
                        value={kvPair}
                    />
                ))}
                <Button block={true} onClick={::this.addEntry}>
                    {"Add"}
                </Button>
            </div>
        );
    }

}
