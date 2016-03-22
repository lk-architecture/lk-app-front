import {PropTypes} from "react";

export const settings = PropTypes.shape({
    awsAccessKeyId: PropTypes.string,
    awsSecretAccessKey: PropTypes.string,
    awsRegion: PropTypes.string,
    dynamodbTablesBaseName: PropTypes.string
});

export const kvPair = PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string
});
export const kvPairList = PropTypes.arrayOf(kvPair);

export const lambda = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    defaultConfiguration: PropTypes.shape({
        git: PropTypes.shape({
            url: PropTypes.string,
            branch: PropTypes.string
        }),
        environment: kvPairList
    })
});
export const lambdaList = PropTypes.arrayOf(lambda);

export const environment = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    services: PropTypes.shape({
        kinesis: PropTypes.shape({
            streamName: PropTypes.string,
            shardsNumber: PropTypes.number
        }),
        lambda: PropTypes.shape({
            lambdas: lambdaList
        })
    })
});
export const environmentList = PropTypes.arrayOf(environment);
