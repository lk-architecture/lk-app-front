import Table from "bootstrap-table-react";
import {propEq} from "ramda";
import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import history from "lib/history";

class Environment extends Component {

    static propTypes = {
        environment: AppPropTypes.environment
    }

    render () {
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
                <p>{`Lambda builds bucket: ${environment.services.s3.lambdaBuildsBucket}`}</p>
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

}

function mapStateToProps (state, props) {
    return {
        environment: state.environments.find(
            propEq("name", props.params.environmentName)
        )
    };
}
export default connect(mapStateToProps)(Environment);
