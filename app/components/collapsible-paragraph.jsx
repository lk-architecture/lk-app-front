import React, {Component, PropTypes} from "react";
import {Collapse} from "react-bootstrap";

import Icon from "components/icon";

const styles = {
    titleContainer: {
        fontSize: "16px",
        cursor: "pointer"
    },
    titleIcon: {
        width: "16px"
    },
    titleLine: {
        marginTop: "5px"
    }
};

export default class CollapsibleParagraph extends Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired
    }

    constructor () {
        super();
        this.state = {collapsed: false};
    }

    toggleCollapse () {
        this.setState({collapsed: !this.state.collapsed});
    }

    render () {
        const {title, children} = this.props;
        return (
            <div>
                <div onClick={::this.toggleCollapse} style={styles.titleContainer}>
                    <Icon
                        icon={this.state.collapsed ? "caret-down" : "caret-right"}
                        style={styles.titleIcon}
                    />
                    {title}
                    <hr style={styles.titleLine} />
                </div>
                <Collapse in={this.state.collapsed}>
                    <div>{children}</div>
                </Collapse>
            </div>
        );
    }
}
