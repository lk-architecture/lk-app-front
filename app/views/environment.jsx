import Table from "bootstrap-table-react";
import {pickBy, propEq, values} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button, Breadcrumb} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";
import {listEnvironments} from "actions/environments";
import {listDeployments} from "actions/deployments";
import {listLambdas} from "actions/lambdas";


class Environment extends Component {

    static propTypes = {
        deployments: PropTypes.any,
        environment: AppPropTypes.environment,
        lambda: AppPropTypes.lambda,
        lambdas: PropTypes.objectOf(AppPropTypes.lambda),
        listDeployments: PropTypes.func.isRequired,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listEnvironments();
        this.props.listDeployments();
        this.props.listLambdas();
    }

    lastDate (deployments, lambda) {
        const last = values(deployments).filter(value => {
            return value.lambdaName === lambda;
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

    renderNotFound () {
        return (
            <div>{"404 - environment not found :("}</div>
        );
    }

    renderPage () {
        const {environment, lambdas, deployments} = this.props;
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
                        <Breadcrumb.Item onClick={() => history.push("/")}>
                            {"Home"}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active={true}>
                          {environment.name}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <h3>{`Environment: ${environment.name}`}</h3>
                    <hr />
                    <h4>{"Kinesis"}</h4>
                    <p>{`Stream name: ${environment.services.kinesis.streamName}`}</p>
                    <p>{`Number of shards: ${environment.services.kinesis.shardsNumber}`}</p>
                    <hr />
                    <h4>{"S3"}</h4>
                    <p>{`Events bucket: ${environment.services.s3.eventsBucket}`}</p>
                    <hr />
                    <h4>{"Lambdas"}</h4>
                    <Table
                        collection={values(lambdas)}
                        columns={[
                            "name",
                            {
                                key: "when",
                                valueFormatter: (value, lambda) => (this.lastDate(deployments, lambda.name))
                            },
                            {
                                key: "edit",
                                valueFormatter: (value, lambda) => (
                                    <Icon
                                        icon="edit"
                                        onClick={() => history.push(`/environments/${environment.name}/lambda/${lambda.name}`)}
                                    />
                                )
                            }
                        ]}
                        onRowClick={(event) => history.push(`/environments/${event.environmentName}/lambda/${event.name}`)}
                        tableOptions={{
                            hover: true,
                            responsive: true,
                            striped: true
                        }}
                    />
                    <Button
                        block={true}
                        onClick={() => history.push(`/environments/${environment.name}/lambda/new`)}
                    >
                        {"Add lambda"}
                    </Button>
                </div>
            </div>
        );
    }

    render () {
        return (
            this.props.environment ? this.renderPage() : this.renderNotFound()
        );
    }

}

function mapStateToProps (state, props) {
    const filterLambdasByEnvironment = pickBy(
        propEq("environmentName", props.params.environmentName)
    );
    return {
        deployments: values(state.deployments.collection).filter(value => {
            return value.environmentName === props.params.environmentName;
        }),
        environment: state.environments.collection[props.params.environmentName],
        lambdas: filterLambdasByEnvironment(state.lambdas.collection)
    };
}

function mapDispatchToProps (dispatch) {
    return {
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Environment);
