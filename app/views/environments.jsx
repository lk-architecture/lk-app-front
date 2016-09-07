import Table from "bootstrap-table-react";
import {values} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Breadcrumb} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";

import {listEnvironments} from "actions/environments";
import {listDeployments} from "actions/deployments";
import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";

class Environments extends Component {

    static propTypes = {
        deployments: PropTypes.any,
        environments: AppPropTypes.environments,
        listDeployments: PropTypes.func.isRequired,
        listEnvironments: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listEnvironments();
        this.props.listDeployments();
    }

    lastDate (deployments, environment) {
        const last = values(deployments).filter(value => {
            return value.environmentName === environment;
        }).sort((a, b) => {
            const x = moment.utc(a.timestamp).valueOf();
            const y = moment.utc(b.timestamp).valueOf();
            return y - x;
        })[0];
        if (last) {
            return moment(last.timestamp).fromNow();
        }
        return "";
    }

    render () {
        const {environments, deployments} = this.props;
        const collection = values(environments.collection);
        moment.updateLocale("en", {
            relativeTime : {
                future: "in %s",
                past:   "%s",
                s:  "seconds ago",
                m:  "a minute ago",
                mm: "%d minutes ago",
                h:  "an hour ago",
                hh: "%d hours ago",
                d:  "a day ago",
                dd: "%d days ago",
                M:  "a month ago",
                MM: "A long time ago in a galaxy far, far away…",
                y:  "A long time ago in a galaxy far, far away…",
                yy: "A long time ago in a galaxy far, far away…"
            }
        });
        return (
            <div>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item active={true}>
                          {"Home"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <Table
                        collection={collection.sort((a, b) => a.name > b.name ? 1 : -1)}
                        columns={[
                            {
                                key:"name"
                            },
                            {
                                key: "when",
                                valueFormatter: (value, environment) => (this.lastDate(deployments, environment.name))
                            },
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
                        onRowClick={(event) => history.push(`/environments/${event.name}`)}
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
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        deployments: state.deployments.collection,
        environments: state.environments
    };
}
function mapDispatchToProps (dispatch) {
    return {
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Environments);
