import Table from "bootstrap-table-react";
import {find, values} from "lodash";
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import {Alert, Breadcrumb, Grid, Col, Well} from "react-bootstrap";

import {listEnvironments} from "actions/environments";
import {createDeployment, listDeployments, clearDeploy} from "actions/deployments";
import {listLambdas, upsertLambda} from "actions/lambdas";
import {getGitHubInfo} from "actions/githubInfo";
import UpsertLambdaForm from "components/upsert-lambda-form";
import Icon from "components/icon";
import history from "lib/history";
import * as AppPropTypes from "lib/app-prop-types";
const styles = {
    header: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        cursor: "pointer"
    },
    loading: {
        alignItems: "center",
        textAlign: "center"
    },
    button: {
        padding: "5pt"
    },
    github: {
        paddingTop: "5px",
        fontSize: "11px"
    }
};

class Lambda extends Component {

    static propTypes = {
        clearDeploy: PropTypes.func.isRequired,
        createDeployment: PropTypes.func.isRequired,
        deployment: PropTypes.shape({
            completed : PropTypes.bool
        }),
        deployments: PropTypes.any,
        environmentName: PropTypes.string.isRequired,
        getGitHubInfo : PropTypes.func.isRequired,
        gitHubInfo: PropTypes.any,
        lambda: AppPropTypes.lambda,
        listDeployments: PropTypes.string.isRequired,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired,
        upsertLambda: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listDeployments();
        this.props.listEnvironments();
        this.props.listLambdas();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.gitHubInfo.general) {
            const name = (nextProps.lambda && nextProps.lambda.name ? nextProps.lambda.name : "");
            if (name != nextProps.gitHubInfo.general.name &&
                nextProps.lambda &&
                !nextProps.gitHubInfo.loading) {
                this.props.getGitHubInfo(nextProps);
            }
        }
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    deploy () {
        const {createDeployment, environmentName, lambda, gitHubInfo} = this.props;
        createDeployment(environmentName, lambda.name, gitHubInfo.general.version);
    }

    clear () {
        const {deployments, clearDeploy, environmentName, lambda} = this.props;
        const name = (lambda && lambda.name ? lambda.name : "");
        const deploymentsCollection = this.sortCollection(name, environmentName, deployments);
        clearDeploy(environmentName, deploymentsCollection);
    }

    sortCollection (lambdaName, environmentName, deployments) {
        const collection = values(deployments.collection).filter(value => {
            return value.environmentName === environmentName && value.lambdaName === lambdaName;
        }).sort((a, b) => {
            const x = moment.utc(a.timestamp).valueOf();
            const y = moment.utc(b.timestamp).valueOf();
            return y - x;
        });
        return collection;
    }

    isLastDeployUpdated (deploymentsCollection, gitHubInfo) {
        const lastDeploy = deploymentsCollection[0];
        if (!gitHubInfo.loading && lastDeploy) {
            const commit = this.lastCommit(gitHubInfo.commits);
            if (commit) {
                return (lastDeploy.version ?
                    (lastDeploy.version==gitHubInfo.general.version && lastDeploy.timestamp>commit.author.date)
                :
                    (lastDeploy.timestamp>commit.author.date)
                );
            }
        }
        return false;
    }

    lastCommit (commits) {
        if (commits) {
            return commits[0].commit;
        }
        return null;
    }

    render () {
        const {deployments, lambda, environmentName, gitHubInfo} = this.props;
        const name = (lambda && lambda.name ? lambda.name : "");
        const deploymentsCollection = this.sortCollection(name, environmentName, deployments);

        var commit = this.lastCommit(gitHubInfo.commits);
        var updateWarning = this.isLastDeployUpdated(deploymentsCollection, gitHubInfo);
        return lambda && commit ? (
            <div>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => history.push("/")}>
                            {"Home"}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => history.push(`/environments/${this.props.environmentName}`)}>
                            {this.props.environmentName}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active={true}>
                          {lambda.name}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <Grid>
                        <Col md={8} xs={12}>
                            <UpsertLambdaForm
                                initialValues={{
                                    name: lambda.name,
                                    githubOrg: lambda.github.org,
                                    githubRepo: lambda.github.repo,
                                    environmentVariables: lambda.environmentVariables,
                                    role: lambda.role
                                }}
                                onSubmit={::this.handleSubmit}
                            />
                        </Col>
                        {!gitHubInfo.loading ?
                            <Col md={4} xs={6}>
                                <Well>
                                    <div style={styles.github}>
                                        <div><b>{"GitHub Info"}</b></div>
                                        <div><b>{"version "}</b>{gitHubInfo.general.version}</div>
                                        <div><b>{"author "}</b>{gitHubInfo.general.author}</div>
                                        <b>{"Description "}</b>{gitHubInfo.general.description}
                                    </div>
                                    <div style={styles.github}>
                                        <div><b>{"Last Commit"}</b></div>
                                        <div><b>{"date "}</b>{commit.author.date}</div>
                                        <div><b>{"message "}</b>{commit.message}</div>
                                        <div><b>{"author "}</b>{commit.author.name}</div>
                                        <div><b>{"email "}</b>{commit.author.email}</div>
                                    </div>
                                    <div style={styles.github}>
                                    {updateWarning ?
                                        <Alert bsStyle="success">
                                            {"The last deploy is updated with the last version from GitHub."}
                                        </Alert>
                                    :
                                        <Alert bsStyle="danger">
                                            <strong>{"Warning: "}</strong>{"The last deploy is not updated with the last version from GitHub."}
                                        </Alert>
                                    }
                                    </div>
                                </Well>
                            </Col>
                        :
                            <Col md={4} xs={6}>
                                <Well>{"GitHub Info - loading please waith"}</Well>
                            </Col>
                        }
                    </Grid>

                    <div style={styles.header}>
                        <div>
                            <h3>{"Deployments"}</h3>
                        </div>

                            {deployments.creationRunning ? null :
                                <div>
                                    <Icon
                                        icon="cloud-upload"
                                        onClick={::this.deploy}
                                        size="30px"
                                        style={styles.button}
                                    />
                                    <Icon
                                        icon="trash"
                                        onClick={::this.clear}
                                        size="30px"
                                        style={styles.button}
                                    />
                                </div>
                            }
                    </div>

                    {deployments.creationRunning ?
                        <div style={styles.loading}>
                            <Icon
                                icon="circle-o-notch"
                                size="90px"
                                spin={true}
                            />
                        </div>
                         :
                        <Table
                            collection={deploymentsCollection}
                            columns={[
                                "id",
                                "awsRegion",
                                "environmentName",
                                "version",
                                {
                                    key: "timestamp",
                                    valueFormatter: time => moment(time).format("HH:mm:ss - MMMM Do YYYY")
                                }
                            ]}
                            tableOptions={{
                                hover: true,
                                responsive: true,
                                striped: true
                            }}
                        />
                    }
                    {deployments.error!=null ?
                        <Alert bsStyle="danger">
                            <strong>{"Error "}</strong>{deployments.error.statusText}
                        </Alert>
                    : ""}
                </div>
            </div>

        ): null;
    }
}

function mapStateToProps (state, props) {
    return {
        deployments: state.deployments,
        environmentName: props.params.environmentName,
        gitHubInfo: state.gitHubInfo,
        lambda: find(state.lambdas.collection, lambda => (
            lambda.environmentName === props.params.environmentName &&
            lambda.name === props.params.lambdaName
        ))
    };
}
function mapDispatchToProps (dispatch) {
    return {
        createDeployment: bindActionCreators(createDeployment, dispatch),
        clearDeploy: bindActionCreators(clearDeploy, dispatch),
        getGitHubInfo: bindActionCreators(getGitHubInfo, dispatch),
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
