import {reduce} from "ramda";

export function arrayToCollection (getIdFromElement, array) {
    return reduce((collection, element) => {
        const id = getIdFromElement(element);
        return {
            ...collection,
            [id]: {...element, id}
        };
    }, {}, array);
}
