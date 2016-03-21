import {identity, pickBy} from "ramda";
import React, {Component, PropTypes} from "react";

export default class Icon extends Component {

    static propTypes = {
        className: PropTypes.string,
        color: PropTypes.string,
        icon: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        size: PropTypes.string,
        spin: PropTypes.bool,
        style: PropTypes.object
    }

    static defaultProps = {
        color: undefined,
        onClick: undefined,
        size: undefined,
        spin: false,
        style: {}
    }

    getClassName () {
        const {className, icon, spin} = this.props;
        return [
            // FontAwesome icon class
            ("fa fa-" + icon),
            // FontAwesome spin class
            (spin ? "fa-spin" : undefined),
            className
        ].filter(identity).join(" ");
    }

    getStyle () {
        const {color, onClick, size, style} = this.props;
        return pickBy(identity, {
            color: color,
            cursor: (onClick ? "pointer" : undefined),
            fontSize: size,
            ...style
        });
    }

    render () {
        const {onClick} = this.props;
        return (
            <i
                className={this.getClassName()}
                onClick={onClick}
                style={this.getStyle()}
            />
        );
    }

}
