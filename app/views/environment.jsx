import Table from "bootstrap-table-react";
import React, {Component, PropTypes} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";
import {listEnvironments, removeLambda} from "actions/environments";

class Environment extends Component {

    static propTypes = {
        environment: AppPropTypes.environment,
        listEnvironments: PropTypes.func.isRequired,
        removeLambda: PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.listEnvironments();
    }

    renderNotFound () {
        return (
            <div>{"404 - environment not found :("}</div>
        );
    }

    renderPage () {
        const {environment} = this.props;
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
                    collection={environment.services.lambda.lambdas}
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
                        },
                        {
                            key: "remove",
                            valueFormatter: (value, lambda) => (
                                <Icon
                                    icon="trash"
                                    onClick={() => {
                                        this.props.removeLambda(environment, lambda.name);
                                    }}
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
    return {
        environment: state.environments.collection[props.params.environmentName]
    };
}
function mapDispatchToProps (dispatch) {
    return {
        listEnvironments: bindActionCreators(listEnvironments, dispatch),
        removeLambda: bindActionCreators(removeLambda, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Environment);
