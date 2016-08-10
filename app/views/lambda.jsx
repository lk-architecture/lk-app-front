import Table from "bootstrap-table-react";
import {find, values} from "lodash";
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import {Alert} from "react-bootstrap";

import {listEnvironments} from "actions/environments";
import {createDeployment, listDeployments, clearDeploy} from "actions/deployments";
import {listLambdas, upsertLambda} from "actions/lambdas";
import UpsertLambdaForm from "components/upsert-lambda-form";
import * as AppPropTypes from "lib/app-prop-types";
import Icon from "components/icon";

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
        lambda: AppPropTypes.lambda,
        listDeployments: PropTypes.func.isRequired,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired,
        upsertLambda: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listDeployments();
        this.props.listEnvironments();
        this.props.listLambdas();
    }

    handleSubmit (lambdaConfiguration) {
        this.props.upsertLambda(this.props.environmentName, lambdaConfiguration);
    }

    deploy () {
        const {createDeployment, environmentName, lambda} = this.props;
        createDeployment(environmentName, lambda.name);
    }

    clear () {
        const {deployments, clearDeploy, environmentName, lambda} = this.props;

        const deploymentsCollection = values(deployments.collection).filter(value => {
            return value.environmentName === lambda.environmentName && value.lambdaName === lambda.name;
        }).sort((a, b) => {
            const x = moment.utc(a.timestamp).valueOf();
            const y = moment.utc(b.timestamp).valueOf();
            return y - x;
        });

        clearDeploy(environmentName, deploymentsCollection);
    }

    render () {
        const {deployments, lambda} = this.props;
        const deploymentsCollection = values(deployments.collection).filter(value => {
            return value.environmentName === lambda.environmentName && value.lambdaName === lambda.name;
        }).sort((a, b) => {
            const x = moment.utc(a.timestamp).valueOf();
            const y = moment.utc(b.timestamp).valueOf();
            return y - x;
        });

        return lambda ? (
            <div>
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
                        <strong>{"Error "}</strong>{deployments.error.toString()}
                    </Alert>
                : ""}
            </div>

        ): null;
    }

}

function mapStateToProps (state, props) {
    return {
        deployments: state.deployments,
        environmentName: props.params.environmentName,
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
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
