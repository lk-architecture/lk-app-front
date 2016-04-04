// export const ENVIRONMENT_DO_DEPLOY = "ENVIRONMENT_DO_DEPLOY";
//
// export function deployLambda (environment, lambdaName) {
//     const settings = store.getState().settings;
//     return dispatch => {
//         let request = {
//             aws: {
//                 region: settings.awsRegion,
//                 accessKeyId: settings.awsRegion,
//                 secretAccessKey: settings.awsSecretAccessKey
//             },
//             services: {
//                 s3: {
//                     ...environment.services.s3
//                 },
//                 "kinesis": {
//                     ...environment.services.kinesis
//                 },
//                 "lambda": {
//                     ...environment.services.lambda.lambdas.find((lambda) => {
//                         return lambda.name === lambdaName;
//                     })
//                 }
//             }
//         };
//         dispatch({
//             type: ENVIRONMENT_DO_DEPLOY,
//             payload: request
//         });
//     };
// }
