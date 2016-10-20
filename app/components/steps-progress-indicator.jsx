import React, {Component} from "react";

import Icon from "components/icon";
import * as AppPropTypes from "lib/app-prop-types";
import * as colors from "lib/colors";

const styles = {
    icon: {
        padding: "5pt"
    }
};

export default class StepsProgressIndicator extends Component {

    static propTypes = {
        steps: AppPropTypes.stepList
    }
    iconType (step) {
        if (step.completed) {
            return "check";
        }
        if (step.error) {
            return "times";
        }
        return "circle-o-notch";
    }

    iconColor (step) {
        if (step.completed) {
            return colors.green;
        }
        if (step.error) {
            return colors.red;
        }
        return "";
    }

    render () {
        const {steps} = this.props;
        return (
            <div>
                {steps.map(step => (
                    <p key={step.id}>
                        <Icon
                            color={this.iconColor(step)}
                            icon={this.iconType(step)}
                            size="20px"
                            spin={!step.completed && !step.error}
                            style={styles.icon}

                        />
                        {step.label}
                    </p>
                ))}
            </div>
        );
    }
}
