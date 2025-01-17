/**
 * Checks if an index is a valid array index.
 */
export const isValidIndex = (array: any[], index: number) => Array.isArray(array)
	&& Number.isInteger(index)
	&& index >= 0
	&& index < array.length;

export type AnyObject = { [key: string]: any };

export const getArrayValue = (array: any[], index: number, defaultValue: any): any =>
{
	if (isValidIndex(array, index))
	{
		return array[index];
	}

	return typeof defaultValue === "function" ? defaultValue() : defaultValue;
};
