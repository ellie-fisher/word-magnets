/**
 * Checks if an index is a valid array index.
 */
export const isValidIndex = (array: any[], index: number) => Array.isArray(array)
	&& Number.isInteger(index)
	&& index >= 0
	&& index < array.length;
