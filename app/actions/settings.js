export const SAVE_SETTINGS = "SAVE_SETTINGS";
export const RESET_SETTINGS_PROGRESS = "RESET_SETTINGS_PROGRESS";

export function saveSettings (settings) {
    return async dispatch => {
        AWS.config.update({
            accessKeyId: settings.awsAccessKeyId,
            secretAccessKey: settings.awsSecretAccessKey,
            region: settings.awsRegion
        });
        dispatch({
            type: SAVE_SETTINGS,
            payload: settings
        });
        setTimeout(() => {
            return dispatch({type: RESET_SETTINGS_PROGRESS});
        }, 2000);
    };
}
