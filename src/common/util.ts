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

export const getObjectValue = (object: AnyObject, key: string, defaultValue: any): any =>
{
	return Object.hasOwn(object, key) ? object[key] : defaultValue;
};

/**
 * It baffles me that this *still* isn't in the standard ES lib.
 */
export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
