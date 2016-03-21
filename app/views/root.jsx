import {isEmpty} from "ramda";
import React, {Component, PropTypes} from "react";
import {Grid} from "react-bootstrap";
import {connect} from "react-redux";

import Header from "components/header";
import * as colors from "lib/colors";
import measures from "lib/measures";

const styles = {
    header: {
        width: "100%",
        height: measures.headerHeightPx
    },
    content: {
        width: "100%"
    },
    emptySettingsWarning: {
        color: colors.red,
        textAlign: "center"
    }
};

class Root extends Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        emptySettings: PropTypes.bool.isRequired
    };

    renderEmptySettingsWarning () {
        return (
            <h3 style={styles.emptySettingsWarning}>
                {"Configuration needed"}
            </h3>
        );
    }

    render () {
        const {children, emptySettings} = this.props;
        return (
            <div>
                <Grid>
                    <div style={styles.header}>
                        <Header />
                    </div>
                </Grid>
                <hr style={{marginTop: "0px"}} />
                <Grid>
                    <div style={styles.content}>
                        {emptySettings ? this.renderEmptySettingsWarning() : children}
                    </div>
                </Grid>
            </div>
        );
    }

}

function mapStateToProps (state) {
    return {
        emptySettings: isEmpty(state.settings)
    };
}
export default connect(mapStateToProps)(Root);
