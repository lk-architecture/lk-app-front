import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Breadcrumb} from "react-bootstrap";

import {saveSettings} from "actions/settings";
import SettingsForm from "components/settings-form";
import {settings} from "lib/app-prop-types";
import history from "lib/history";

class Settings extends Component {

    static propTypes = {
        hasRehydrated: PropTypes.bool.isRequired,
        saveSettings: PropTypes.func.isRequired,
        settings: settings.isRequired,
        settingsSaved: PropTypes.bool.isRequired
    }

    handleSubmit (settings) {
        this.props.saveSettings(settings);
    }

    renderForm () {
        const {hasRehydrated, settings, settingsSaved} = this.props;
        return hasRehydrated ? (
            <SettingsForm
                initialValues={settings}
                onSubmit={::this.handleSubmit}
                saved={settingsSaved}
            />
        ) : null;
    }

    render () {
        return (
            <div>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => history.push("/")}>
                            {"Home"}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active={true}>
                          {"Settings"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <h2>
                        {"Settings"}
                    </h2>
                    <hr />
                    {this.renderForm()}
                </div>
            </div>
        );
    }

}

function mapStateToProps (state) {
    return {
        hasRehydrated: state.hasRehydrated,
        settings: state.settings,
        settingsSaved: state.settingsCreation.completed
    };
}
function mapDispatchToProps (dispatch) {
    return {
        saveSettings: bindActionCreators(saveSettings, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
