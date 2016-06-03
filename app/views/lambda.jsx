import Table from "bootstrap-table-react";
import {find, values} from "lodash";
import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";

import {listEnvironments} from "actions/environments";
import {createDeployment, listDeployments} from "actions/deployments";
import {listLambdas, upsertLambda} from "actions/lambdas";
import UpsertLambdaForm from "components/upsert-lambda-form";
import * as AppPropTypes from "lib/app-prop-types";

class Lambda extends Component {

    static propTypes = {
        createDeployment: PropTypes.func.isRequired,
        deploymentCreation: PropTypes.shape({
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

    render () {
        const {deploymentCreation, deployments, lambda} = this.props;
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
                <h3>{"Deployments"}</h3>
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
                <Button disabled={!deploymentCreation.completed} onClick={::this.deploy}>
                    {deploymentCreation.completed ? "Deploy" : "Deploying"}
                </Button>
            </div>
        ) : null;
    }

}

function mapStateToProps (state, props) {
    return {
        deploymentCreation: state.deploymentCreation,
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
        listDeployments: bindActionCreators(listDeployments, dispatch),
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch),
        upsertLambda: bindActionCreators(upsertLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Lambda);
