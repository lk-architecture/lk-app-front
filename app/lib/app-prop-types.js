import {PropTypes} from "react";

export const settings = PropTypes.shape({
    awsAccessKeyId: PropTypes.string,
    awsSecretAccessKey: PropTypes.string,
    awsRegion: PropTypes.string,
    dynamodbEndpoint: PropTypes.string,
    kinesisEndpoint: PropTypes.string,
    s3Endpoint: PropTypes.string
});

export const kvPair = PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string
});
export const kvPairList = PropTypes.arrayOf(kvPair);

export const lambda = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    environmentVariables: kvPairList.isRequired,
    github: PropTypes.shape({
        org: PropTypes.string.isRequired,
        repo: PropTypes.string.isRequired
    }).isRequired,
    role: PropTypes.string.isRequired
});
export const lambdas = PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    fetchingError: PropTypes.instanceOf(Error),
    collection: PropTypes.objectOf(lambda).isRequired
});

export const environment = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    services: PropTypes.shape({
        s3: PropTypes.shape({
            eventsBucket: PropTypes.string.isRequired
        }),
        kinesis: PropTypes.shape({
            streamName: PropTypes.string.isRequired,
            shardsNumber: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
});
export const environments = PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    fetchingError: PropTypes.instanceOf(Error),
    collection: PropTypes.objectOf(environment).isRequired
});

export const step = PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    completed: PropTypes.bool
});
export const stepList = PropTypes.arrayOf(step);

export const environmentCreation = PropTypes.shape({
    completed: PropTypes.bool,
    steps: PropTypes.arrayOf(step)
});
