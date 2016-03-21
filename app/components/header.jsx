import React, {Component} from "react";

import Icon from "components/icon";
import history from "lib/history";

const styles = {
    header: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    }
};

export default class Header extends Component {

    render () {
        return (
            <div style={styles.header}>
                <div>
                    <h4>{"lk-app"}</h4>
                </div>
                <div>
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
