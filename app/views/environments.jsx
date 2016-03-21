import Table from "bootstrap-table-react";
import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";

class Environments extends Component {

    static propTypes = {
        environments: AppPropTypes.environmentList
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
export default connect(mapStateToProps)(Environments);
