/**
 * Elt is array?
 */
export const isArray = (elt: unknown): elt is unknown[] => {
    return Array.isArray(elt);
};
/**
 * Array is included in other?
 */
export const arrayIsIncluded = <U>(arr1: U[], arr2: U[]): boolean => {
    return arr1.every((value) => arr2.includes(value));
};
/**
 * Elt is empty?
 */
export const isEmpty = (elt?: number | unknown[] | boolean): boolean => {
    return isArray(elt) ? !elt.length : !!elt;
};
