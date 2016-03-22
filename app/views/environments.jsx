import Table from "bootstrap-table-react";
import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {listEnvironments} from "actions/environments";
import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";

class Environments extends Component {

    static propTypes = {
        environments: AppPropTypes.environmentList,
        listEnvironments: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listEnvironments();
    }

    render () {
        return (
            <div>
                <Table
                    collection={this.props.environments}
                    columns={[
                        "id",
                        "name",
                        {
                            key: "edit",
                            valueFormatter: (value, environment) => (
                                <Icon
                                    icon="edit"
                                    onClick={() => history.push(`/environments/${environment.name}`)}
                                />
                            )
                        }
                    ]}
                    tableOptions={{
                        hover: true,
                        responsive: true,
                        striped: true
                    }}
                />
                <Button block={true} onClick={() => history.push("/environments/new")}>
                    {"Create environment"}
                </Button>
            </div>
        );
    }

}

function mapStateToProps (state) {
    return {
        environments: state.environments
    };
}
function mapDispatchToProps (dispatch) {
    return {
        listEnvironments: bindActionCreators(listEnvironments, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Environments);
