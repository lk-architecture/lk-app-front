import {
    ENVIRONMENTS_LIST_START,
    ENVIRONMENTS_LIST_SUCCESS,
    ENVIRONMENTS_LIST_ERROR
} from "actions/environments";
import {arrayToCollection} from "lib/utils";

const defaultEnvironments = {
    fetching: false,
    fetchingError: null,
    collection: {}
};

export default function environments (state = defaultEnvironments, action) {
    const {type, payload} = action;
    switch (type) {
    case ENVIRONMENTS_LIST_START:
        return {
            ...state,
            fetching: true,
            fetchingError: null
        };
    case ENVIRONMENTS_LIST_SUCCESS:
        return {
            fetching: false,
            fetchingError: null,
            collection: {
                ...state.collection,
                ...arrayToCollection(payload)
            }
        };
    case ENVIRONMENTS_LIST_ERROR:
        return {
            ...state,
            fetching: false,
            fetchingError: payload
        };
    default:
        return state;
    }
}


// {
//     id: "lambda11",
//     name: "lambda11",
//     defaultConfiguration: {
//         git: {
//             url: "https://github.com/example/lambda11.git",
//             branch: "master"
//         },
//         environment: [
//             {
//                 key: "key111",
//                 value: "value111"
//             },
//             {
//                 key: "key112",
//                 value: "value112"
//             }
//         ]
//     },
//     deployments: [
//         {
//             id: "lambda11deploy1",
//             date: new Date("2016-01-01").toISOString(),
//             configuration: {
//                 git: {
//                     repoUrl: "https://github.com/example/lambda11.git",
//                     commit: "commit"
//                 },
//                 bundleUrl: "https://s3.amazon.com/...",
//                 environment: [
//                     {
//                         key: "key111",
//                         value: "value111"
//                     },
//                     {
//                         key: "key112",
//                         value: "value112"
//                     }
//                 ]
//             }
//         }
//     ]
// }
