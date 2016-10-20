import Table from "bootstrap-table-react";
import {find, values} from "lodash";
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import {Alert, Breadcrumb, Grid, Col} from "react-bootstrap";

import {listEnvironments} from "actions/environments";
import {createDeployment, listDeployments, clearDeploy} from "actions/deployments";
import {listLambdas, upsertLambda} from "actions/lambdas";
import {getGithubInfo} from "actions/github-info";
import UpsertLambdaForm from "components/upsert-lambda-form";
import GitHub from "components/github";
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
        getGithubInfo : PropTypes.func.isRequired,
        githubInfo: PropTypes.any,
        lambda: AppPropTypes.lambda,
        listDeployments: PropTypes.func.isRequired,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired,
        upsertLambda: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);
        this.state = {
            githubLoaded: false
        };
    }

    componentWillMount () {
        this.props.listDeployments();
        this.props.listEnvironments();
        this.props.listLambdas();
    }

    componentWillReceiveProps (nextProps) {
        if (!this.state.githubLoaded && nextProps.lambda && nextProps.lambda.github) {
            this.setState({githubLoaded: true});
            this.props.getGithubInfo(nextProps.lambda.github);
        }
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    deploy () {
        const {createDeployment, environmentName, lambda, githubInfo} = this.props;
        createDeployment(environmentName, lambda.name, githubInfo.general.version);
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

    render () {
        const {deployments, lambda, environmentName, githubInfo} = this.props;
        const name = (lambda && lambda.name ? lambda.name : "");
        const deploymentsCollection = this.sortCollection(name, environmentName, deployments);
        return lambda ? (
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
                        <Col md={4} xs={6}>
                            <GitHub
                                collection={deploymentsCollection}
                                info={githubInfo}
                            />
                        </Col>
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
        githubInfo: state.githubInfo,
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
        getGithubInfo: bindActionCreators(getGithubInfo, dispatch),
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
