import React from "react";
import {get} from "lodash";

export function renderCommitUrl (url) {
    return (url ? (
        <a href={url} target="_blank">{url.substring(url.indexOf("commit") + 7, url.indexOf("commit") + 14)}</a>
    ) : null);
}

export function lastCommit (commits) {
    return get(commits, "0", null);
}
