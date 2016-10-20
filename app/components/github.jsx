import React, {Component, PropTypes} from "react";
import {Alert, Well} from "react-bootstrap";
import {get} from "lodash";

import Icon from "components/icon";

const styles = {
    github: {
        paddingTop: "5px",
        fontSize: "11px"
    }
};

export default class GitHub extends Component {

    static propTypes = {
        collection: PropTypes.array.isRequired,
        info: PropTypes.object.isRequired
    }

    getAlert (title, text, type) {
        return (
            <Alert bsStyle={type}>
                <strong>{title}</strong>{text}
            </Alert>
        );
    }

    isLastDeployUpdated (deploymentsCollection, githubInfo) {
        const lastDeploy = deploymentsCollection[0];
        if (!githubInfo.loading && lastDeploy) {
            const commit = this.lastCommit(githubInfo.commits);
            if (commit) {
                return (lastDeploy.version ?
                    (lastDeploy.version==githubInfo.general.version && lastDeploy.timestamp>commit.author.date)
                :
                    (lastDeploy.timestamp>commit.author.date)
                );
            }
        }
        return false;
    }

    lastCommit (commits) {
        return get(commits, "0.commit", null);
    }

    renderInfo (info, collection) {
        const commit = this.lastCommit(info.commits);

        return !info.loading && commit? (
            <div>
                <Well>
                    <Icon
                        icon="github"
                        size="30px"
                    />
                    <div style={styles.github}>
                        <div><b>{"GitHub Info"}</b></div>
                        <div><b>{"version "}</b>{info.general.version}</div>
                        <div><b>{"author "}</b>{info.general.author}</div>
                        <b>{"Description "}</b>{info.general.description}
                    </div>
                    <div style={styles.github}>
                        <div><b>{"Last Commit"}</b></div>
                        <div><b>{"date "}</b>{commit.author.date}</div>
                        <div><b>{"message "}</b>{commit.message}</div>
                        <div><b>{"author "}</b>{commit.author.name}</div>
                        <div><b>{"email "}</b>{commit.author.email}</div>
                    </div>
                </Well>
                <div style={styles.github}>
                    {this.renderWarnig (collection, info)}
                </div>
            </div>
        ) : (
            <div style={styles.github}>
                {this.getAlert("Loading: ", "Please wait", "info")}
            </div>
        );
    }

    renderWarnig (deploymentsCollection, githubInfo) {
        if (deploymentsCollection.length==0) {
            return this.getAlert("Warning: ", "There is no deploy available for this lambda function.", "warning");
        } else {
            const updateWarning = this.isLastDeployUpdated(deploymentsCollection, githubInfo);

            return updateWarning ? (
                this.getAlert("Updated: ", "The last deploy is updated with the latest version from GitHub.", "success")
            ):(
                this.getAlert("Warning: ", "The last deploy is not updated with the latest version from GitHub.", "danger")
            );
        }
    }

    render () {
        const {info, collection} = this.props;

        return info.error ? (
            <div style={styles.github}>
                {this.getAlert("Error: ", "Lambda not found on GitHub, please verifiy all informations.", "danger")}
            </div>
        ) : (
            this.renderInfo(info, collection)
        );
    }
}
