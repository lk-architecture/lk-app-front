export const SAVE_SETTINGS = "SAVE_SETTINGS";

export function saveSettings (settings) {
    AWS.config.update({
        accessKeyId: settings.awsAccessKeyId,
        secretAccessKey: settings.awsSecretAccessKey,
        region: settings.awsRegion
    });
    return {
        type: SAVE_SETTINGS,
        payload: settings
    };
}
