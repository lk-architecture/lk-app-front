export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export function login (accessKeyId, secretAccessKey) {
    return {
        type: LOGIN,
        payload: {accessKeyId, secretAccessKey}
    };
}

export function logout () {
    return {
        type: LOGOUT
    };
}
