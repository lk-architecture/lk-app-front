import React, {Component, PropTypes} from "react";
import {Alert, Well} from "react-bootstrap";

import Icon from "components/icon";
import {renderCommitUrl, lastCommit} from "lib/github-utils";

const styles = {
    github: {
        paddingTop: "5px",
        fontSize: "11px"
    }
};

export default class Github extends Component {

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
            const commitElement = lastCommit(githubInfo.commits);
            if (commitElement) {
                const {author} = commitElement.commit;
                return (lastDeploy.version ?
                    (lastDeploy.version==githubInfo.general.version && lastDeploy.timestamp>author.date)
                :
                    (lastDeploy.timestamp>author.date)
                );
            }
        }
        return false;
    }

    renderCommit (commitElement) {
        const {author, message} = commitElement.commit;
        return (
            <div style={styles.github}>
                <div>
                    <b>{"Last Commit "}</b>
                    {renderCommitUrl(commitElement.html_url)}
                </div>
                <div><b>{"date "}</b>{author.date}</div>
                <div><b>{"message "}</b>{message}</div>
                <div><b>{"author "}</b>{author.name}</div>
                <div><b>{"email "}</b>{author.email}</div>
            </div>
        );
    }

    renderInfo (info, collection) {
        const commitElement = lastCommit(info.commits);
        return !info.loading && commitElement? (
            <div>
                <Well>
                    <Icon
                        icon="github"
                        size="30px"
                    />
                    <div style={styles.github}>
                        <div><b>{"Github Info"}</b></div>
                        <div><b>{"version "}</b>{info.general.version}</div>
                        <div><b>{"author "}</b>{info.general.author}</div>
                        <b>{"Description "}</b>{info.general.description}
                    </div>
                    {this.renderCommit(commitElement)}
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
                this.getAlert("Updated: ", "The last deploy is updated with the latest version from Github.", "success")
            ):(
                this.getAlert("Warning: ", "The last deploy is not updated with the latest version from Github.", "warning")
            );
        }
    }

    render () {
        const {info, collection} = this.props;

        return info.error ? (
            <div style={styles.github}>
                {this.getAlert("Error: ", "Lambda not found on Github, please verifiy all informations.", "danger")}
            </div>
        ) : (
            this.renderInfo(info, collection)
        );
    }
}
