import has from "../../../common/src/util/has";


const validateFields = ( fields: object, validation: object ): any[] =>
{
	const keys: string[] = Object.keys (validation);

	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key: string = keys[i];

		const { type, min, max, required = false } = validation[key];

		if ( !has (fields, key) && required )
		{
			return [key, "Missing required field"];
		}

		const value: any = fields[key];

		switch ( type )
		{
			case "string":
			{
				if ( value.length < min )
				{
					return [key, `Must be at least ${min} character(s)`];
				}

				if ( value.length > max )
				{
					return [key, `Cannot be more than ${max} character(s)`];
				}

				if ( typeof value !== "string" )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof value}\``];
				}

				break;
			}

			case "number":
			case "integer":
			{
				if ( value < min )
				{
					return [key, `Must be at least ${min}`];
				}

				if ( value > max )
				{
					return [key, `Cannot be more than ${max}`];
				}

				if ( (type === "integer" && !Number.isInteger (value))
					|| typeof value !== "number"
					|| isNaN (value) )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof value}\``];
				}
			}

			default:
			{
				throw new Error (`Unhandled/Unknown type \`${type}\``);
			}
		}
	}

	return [];
};


export default validateFields;
