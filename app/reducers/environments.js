export default function environments () {
    return [
        {
            id: "environment1",
            name: "dev",
            services: {
                kinesis: {
                    streamName: "entrypoint",
                    shardsNumber: 8
                },
                lambda: {
                    // TODO
                    // sharedConfiguration: {},
                    lambdas: [
                        {
                            id: "lambda11",
                            name: "lambda11",
                            defaultConfiguration: {
                                git: {
                                    url: "https://github.com/example/lambda11.git",
                                    branch: "master"
                                },
                                environment: [
                                    {
                                        key: "key111",
                                        value: "value111"
                                    },
                                    {
                                        key: "key112",
                                        value: "value112"
                                    }
                                ]
                            },
                            deployments: [
                                {
                                    id: "lambda11deploy1",
                                    date: new Date("2016-01-01").toISOString(),
                                    configuration: {
                                        git: {
                                            repoUrl: "https://github.com/example/lambda11.git",
                                            commit: "commit"
                                        },
                                        bundleUrl: "https://s3.amazon.com/...",
                                        environment: [
                                            {
                                                key: "key111",
                                                value: "value111"
                                            },
                                            {
                                                key: "key112",
                                                value: "value112"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ];
}
