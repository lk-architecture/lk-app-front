import React, {Component} from "react";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import * as colors from "lib/colors";

export default class StepsProgressIndicator extends Component {

    static propTypes = {
        steps: AppPropTypes.stepList
    }

    render () {
        const {steps} = this.props;
        return (
            <div>
                {steps.map(step => (
                    <p key={step.id}>
                        <Icon
                            color={step.completed ? colors.green : ""}
                            icon={step.completed ? "check" : "times"}
                        />
                        {step.label}
                    </p>
                ))}
            </div>
        );
    }
}
