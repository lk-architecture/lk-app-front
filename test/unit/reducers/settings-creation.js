import {expect} from "chai";

import {
    RESET_SETTINGS_PROGRESS,
    SAVE_SETTINGS
} from "actions/settings";

import settingsCreation from "reducers/settings-creation";

describe("Settings Creations reducer", () => {

    it("Expect settings to be saved", () => {
        const action = {
            type: SAVE_SETTINGS,
        };

        const ret = settingsCreation({}, action);
        expect(ret).to.deep.equal({
            completed: true,
            error:null
        });
    });

    it("Expect settings to be reset", () => {
        const action = {
            type: RESET_SETTINGS_PROGRESS,
        };

        const ret = settingsCreation({}, action);
        expect(ret).to.deep.equal({
            completed: false,
            error:null
        });
    });
});
