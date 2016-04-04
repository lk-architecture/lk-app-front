function safetyWrapper (dispatch) {
    return action => {
        try {
            return dispatch(action);
        } catch (err) {
            console.error("Dispatch error", err);
        }
    };
}

export default function safeDispatchThunk ({dispatch, getState}) {
    return next => action => {
        if (typeof action === "function") {
            return action(safetyWrapper(dispatch), getState);
        }
        return next(action);
    };
}
