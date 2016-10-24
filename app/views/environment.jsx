import Table from "bootstrap-table-react";
import {pickBy, propEq, values} from "ramda";
import React, {Component, PropTypes} from "react";
import {Alert, Button, Breadcrumb, Col, Input, Grid} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import {get} from "lodash";

import {listDeployments} from "actions/deployments";
import {listEnvironments} from "actions/environments";
import {listLambdas} from "actions/lambdas";
import {listRepoInfo, getGithubStatus} from "actions/github-info";
import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import {lastDate, getMoment} from "lib/date-utils";
import history from "lib/history";

const styles = {
    button: {
        padding: "5pt"
    },

    colLeft: {
        textAlign: "left"
    },

    colRight: {
        textAlign: "right"
    }
};

class Environment extends Component {

    static propTypes = {
        deployments: PropTypes.any,
        environment: AppPropTypes.environment,
        getGithubStatus: PropTypes.func.isRequired,
        githubInfo: PropTypes.any,
        githubStatus: PropTypes.any,
        lambda: AppPropTypes.lambda,
        lambdas: PropTypes.objectOf(AppPropTypes.lambda),
        listDeployments: PropTypes.func.isRequired,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired,
        listRepoInfo: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);
        this.state = {
            githubLoaded: false,
            firstNewest: true,
            lambdaFilter: ""
        };
    }

    componentWillMount () {
        this.props.listEnvironments();
        this.props.listDeployments();
        this.props.listLambdas();
        this.props.getGithubStatus();
    }

    componentWillReceiveProps (nextProps) {
        if (values(nextProps.lambdas).length>0 && !this.state.githubLoaded) {
            const orgs = values(nextProps.lambdas).map(function (obj) {
                return obj.github.org;
            });
            const distinctOrgs = orgs.filter(function (v, i) {
                return orgs.indexOf(v) == i;
            });

            this.setState({
                githubLoaded: true
            });
            this.props.listRepoInfo(distinctOrgs);
        }
    }

    editCollection () {
        const {lambdas, deployments} = this.props;
        values(lambdas).forEach(value =>
            value.timestamp=lastDate(deployments, (valueFilter) => {
                return valueFilter.lambdaName === value.name;
            }
        ));

        return this.filterCollection(lambdas);
    }

    filterCollection (lambdas) {
        const filtered = values(lambdas).filter(value => {
            return value.name.match(this.state.lambdaFilter);
        });
        return filtered;
    }

    changeSort (sort) {
        (sort != this.state.firstNewest ?
            this.setState({firstNewest: sort}) :
            null
        );
    }

    onChangeSearch () {
        return event => {
            this.setState({lambdaFilter: event.target.value});
        };
    }

    sortLambda () {
        const {environment} = this.props;
        const lambdas = this.editCollection();

        const collection = values(lambdas).filter(value => {
            return value.environmentName === environment.name;
        }).sort((a, b) => {
            const x = moment.utc((a.timestamp ? a.timestamp : moment())).valueOf();
            const y = moment.utc((b.timestamp ? b.timestamp : moment())).valueOf();
            return (this.state.firstNewest ? y - x : x - y);
        });
        return collection;
    }

    checkGithub (lambdas) {
        values(lambdas).forEach(value =>{
            value.github.infoUpdate = this.isInRepo(value);
            value.github.info = this.findInRepo(value);
        });
        return lambdas;
    }

    findInRepo (lambda) {
        const repoInfoError = get(this.props, "githubInfo.repoInfo['"+ lambda.github.org + "'].error", null);
        if (repoInfoError) {
            return null;
        }
        const repoInfo = get(this.props, "githubInfo.repoInfo['"+ lambda.github.org + "'].data", null);

        const info = (repoInfo ? repoInfo.find(value => {
            return value.name==lambda.github.repo;
        }) : null);


        return info;
    }

    isInRepo (lambda) {
        const repoInfoError = get(this.props, "githubInfo.repoInfo['"+ lambda.github.org + "'].error", null);
        if (repoInfoError) {
            return -2;
        }
        const repoInfo = get(this.props, "githubInfo.repoInfo['"+ lambda.github.org + "'].data", null);
        if (repoInfo==null || repoInfo.length < 1) { // repo not retrieved - loading)
            return -1;
        }

        const info = repoInfo.find(value => {
            return value.name==lambda.github.repo;
        });

        if (!info) { // lambda not found
            return 0;
        }

        if (!lambda.timestamp) {  // lambda never deployed
            return 1;
        }

        if (lambda.timestamp < info.pushed_at) { // lambda not updated
            return 2;
        }
        return 3; // lambda updated
    }

    githubIcon (icon) {
        switch (icon) {
        case -2:
            return "remove";
        case -1:
            return "circle-o-notch";
        default:
            return "github-square";
        }
    }

    githubColor (icon) {
        switch (icon) {
        case -2:
        case 0 :
            return "#ff1744";
        case 1 :
        case 2 :
            return "#ffd600";
        case 3 :
            return "#00e676";
        default:
            return "";
        }
    }

    githubMessage (icon) {
        switch (icon) {
        case -2:
            return "Service Issue";
        case 0 :
            return "lambda not found";
        case 1 :
            return "lambda never deployed";
        case 2 :
            return "lambda not updated";
        case 3 :
            return "lambda updated";
        default:
            return "";
        }
    }

    renderAlert (status) {
        const limit = get(status, "resources.core.limit", null);
        const remaining = get(status, "resources.core.remaining", null);
        const reset = get(status, "resources.core.reset", null);
        if (limit &&  reset && (remaining < 3)) {
            const resetDate = new Date(reset * 1000);
            return (
                <Alert bsStyle="danger">
                    <strong>{"Alert: "}</strong>
                    {" You have reached the github API limit, next reset " + getMoment(resetDate)}
                </Alert>
            );
        }
        return null;
    }

    renderNotFound () {
        return (
            <div>{"404 - environment not found :("}</div>
        );
    }

    renderTable () {
        const lambdasWithSort = this.sortLambda();
        const lambdas = this.checkGithub(lambdasWithSort);
        const {environment} = this.props;
        return (
            <Table
                collection={lambdas}
                columns={[
                    "name",
                    {
                        key: "last deploy",
                        valueFormatter: (value, lambda) => (getMoment(lambda.timestamp))
                    },
                    {
                        key: "github",
                        valueFormatter: (value, lambda) => (
                            <Icon
                                color={this.githubColor(lambda.github.infoUpdate)}
                                icon={this.githubIcon(lambda.github.infoUpdate)}
                                size="25px"
                                spin={lambda.github.infoUpdate==-1}
                            />
                        )
                    },
                    {
                        key: "",
                        valueFormatter: (value, lambda) => (
                            this.githubMessage(lambda.github.infoUpdate)
                        )
                    },
                    {
                        key: "edit",
                        valueFormatter: (value, lambda) => (
                            <Icon
                                icon="edit"
                                onClick={() => history.push(`/environments/${environment.name}/lambda/${lambda.name}`)}
                                size="20px"
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
        );
    }

    renderPage () {
        const {environment} = this.props;
        const status = (this.props.githubStatus ? this.props.githubStatus.data : null);
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
                    <div>
                        <div><h3>{`Environment: ${environment.name}`}</h3></div>
                        <div>{this.renderAlert(status)}</div>
                    </div>
                    <hr />
                    <h4>{"Kinesis"}</h4>
                    <p>{`Stream name: ${environment.services.kinesis.streamName}`}</p>
                    <p>{`Number of shards: ${environment.services.kinesis.shardsNumber}`}</p>
                    <hr />
                    <h4>{"S3"}</h4>
                    <p>{`Events bucket: ${environment.services.s3.eventsBucket}`}</p>
                    <hr />
                    <h4>{"Lambdas"}</h4>
                    <Grid>
                        <Col md={4} style={styles.colLeft} xs={4}>
                            <Input
                                onChange={this.onChangeSearch("value")}
                                placeholder="search lambda"
                                type="text"
                            />
                        </Col>
                        <Col md={8}  style={styles.colRight} xs={8}>
                            <Icon
                                icon="sort-numeric-asc"
                                onClick={() => this.changeSort(true)}
                                size="20px"
                                style={styles.button}
                            />
                            <Icon
                                icon="sort-numeric-desc"
                                onClick={() => this.changeSort(false)}
                                size="20px"
                                style={styles.button}
                            />
                        </Col>
                    </Grid>

                    {this.renderTable()}
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
        lambdas: filterLambdasByEnvironment(state.lambdas.collection),
        githubInfo: state.githubInfo,
        githubStatus: (state.githubInfo.githubStatus ? state.githubInfo.githubStatus : props.githubStatus)
    };
}

function mapDispatchToProps (dispatch) {
    return {
        getGithubStatus: bindActionCreators(getGithubStatus, dispatch),
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        listRepoInfo: bindActionCreators(listRepoInfo, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Environment);
