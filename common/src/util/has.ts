const { hasOwnProperty } = Object.prototype;

/**
 * A safe wrapper for `object.hasOwnProperty()`.
 *
 * This is recommended because `.hasOwnProperty` can be overwritten on objects.
 * `key in object` and `object.key !== undefined` are not suitable alternatives either.
 */
const has = ( object: object, key: string ): boolean =>
{
	return hasOwnProperty.call (object, key);
};


export default has;
