import has from "../../../common/src/util/has";


/**
 * Sets default values to fields that don't have a default value set.
 *
 * @param {object} fields
 * @param {object} validation
 *
 * @returns {object} A copy of `fields` with empty values replaced with default ones.
 */
const applyDefaults = ( fields: object, validation: object ) =>
{
	const copy = { ...fields };
	const keys: string[] = Object.keys (validation);

	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key: string = keys[i];
		const data: any = validation[key];

		if ( !has (copy, key) && has (data, "defaultValue") )
		{
			copy[key] = data.defaultValue;
		}
	}

	return copy;
};


export default applyDefaults;
