import {reduce} from "ramda";

export const arrayToCollection = reduce((collection, element) => ({
    ...collection,
    [element.id]: element
}), {});
