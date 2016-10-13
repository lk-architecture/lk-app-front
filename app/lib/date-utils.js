import moment from "moment";
import {values} from "ramda";

moment.updateLocale("en", {
    relativeTime: {
        future: "In %s",
        past: "%s",
        s: "Seconds ago",
        m: "A minute ago",
        mm: "%d minutes ago",
        h: "An hour ago",
        hh: "%d hours ago",
        d: "A day ago",
        dd: "%d days ago",
        M: "A month ago",
        MM: "A long time ago in a galaxy far, far away...",
        y: "A long time ago in a galaxy far, far away...",
        yy: "A long time ago in a galaxy far, far away..."
    }
});

export function getMoment (data) {
    if (data) {
        return moment.utc(data).fromNow();
    }
    return "Never evah...";
}

export function lastDate (collection, filter) {
    const last = values(collection).filter(value => {
        return filter(value);
    }).sort((a, b) => {
        const x = moment.utc(a.timestamp).valueOf();
        const y = moment.utc(b.timestamp).valueOf();
        return y - x;
    })[0];
    if (last) {
        return last.timestamp;
    }
    return null;
}
