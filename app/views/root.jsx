import React, {Component, PropTypes} from "react";
import {Grid} from "react-bootstrap";

import Header from "components/header";
import measures from "lib/measures";

const styles = {
    header: {
        width: "100%",
        height: measures.headerHeightPx
    },
    content: {
        width: "100%"
    }
};

class Root extends Component {

    static propTypes = {
        children: PropTypes.node
    };

    render () {
        const {children} = this.props;
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
                        {children}
                    </div>
                </Grid>

            </div>
        );
    }

}

export default Root;
