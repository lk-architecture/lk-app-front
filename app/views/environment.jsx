import Table from "bootstrap-table-react";
import {pickBy, propEq, values} from "ramda";
import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";
import {listEnvironments} from "actions/environments";
import {listLambdas} from "actions/lambdas";

class Environment extends Component {

    static propTypes = {
        environment: AppPropTypes.environment,
        lambdas: PropTypes.any,
        listEnvironments: PropTypes.func.isRequired,
        listLambdas: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listEnvironments();
        this.props.listLambdas();
    }

    renderNotFound () {
        return (
            <div>{"404 - environment not found :("}</div>
        );
    }

    renderPage () {
        const {environment, lambdas} = this.props;
        return (
            <div>
                <h3>{`Environment: ${environment.name}`}</h3>
                <hr />
                <h4>{"Kinesis"}</h4>
                <p>{`Stream name: ${environment.services.kinesis.streamName}`}</p>
                <p>{`Number of shards: ${environment.services.kinesis.shardsNumber}`}</p>
                <hr />
                <h4>{"S3"}</h4>
                <p>{`Lambda builds bucket: ${environment.services.s3.lambdasBucket}`}</p>
                <p>{`Events bucket: ${environment.services.s3.eventsBucket}`}</p>
                <hr />
                <h4>{"Lambdas"}</h4>
                <Table
                    collection={values(lambdas)}
                    columns={[
                        "name",
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
        environment: state.environments.collection[props.params.environmentName],
        lambdas: filterLambdasByEnvironment(state.lambdas.collection)
    };
}
function mapDispatchToProps (dispatch) {
    return {
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        listLambdas: bindActionCreators(listLambdas, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Environment);
