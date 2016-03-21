import React, {Component, PropTypes} from "react";
import {Grid} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {login} from "actions/auth";
import Header from "components/header";
import LoginModal from "components/login-modal";
import {auth} from "lib/app-prop-types";
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
        auth: auth.isRequired,
        children: PropTypes.node.isRequired,
        login: PropTypes.func.isRequired
    };

    renderApp () {
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

    renderLogin () {
        const {login} = this.props;
        return (
            <LoginModal onLogin={login} />
        );
    }

    render () {
        const {auth} = this.props;
        return (
            auth.isLoggedIn ?
            this.renderApp() :
            this.renderLogin()
        );
    }

}

function mapStateToProps (state) {
    return {
        auth: state.auth
    };
}
function mapDispatchToProps (dispatch) {
    return {
        login: bindActionCreators(login, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Root);
