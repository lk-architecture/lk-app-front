import React, {Component, PropTypes} from "react";

import Icon from "components/icon";
import Spacer from "components/spacer";
import * as colors from "lib/colors";
import history from "lib/history";

const styles = {
    header: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        cursor: "pointer"
    },
    emptySettingsWarning: {
        color: colors.red
    }
};

export default class Header extends Component {

    static propTypes = {
        emptySettings: PropTypes.bool.isRequired
    }

    renderEmptySettingsWarning () {
        const {emptySettings} = this.props;
        return emptySettings ? (
            <span style={styles.emptySettingsWarning}>
                {"Configuration needed"}
                <Spacer direction="h" size={10} />
                <Icon icon="arrow-right" />
            </span>
        ) : null;
    }

    render () {
        return (
            <div style={styles.header}>
                <div>
                    <h4 onClick={() => history.push("/")} style={styles.logo}>
                        {"lk-app"}
                    </h4>
                </div>
                <div>
                    {this.renderEmptySettingsWarning()}
                    <Spacer direction="h" size={10} />
                    <Icon
                        icon="gear"
                        onClick={() => history.push("/settings")}
                        size="18px"
                    />
                </div>
            </div>
        );
    }

}
