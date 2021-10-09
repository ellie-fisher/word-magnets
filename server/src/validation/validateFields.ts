import has from "../../../common/src/util/has";


const validateFields = ( fields: object, validation: object ): any[] =>
{
	const keys = Object.keys (fields);

	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key = fields[i];
		const field = fields[key];

		if ( !has (validation, key) )
		{
			return [key, "Unknown field"];
		}

		const { type, min, max } = validation[key];

		switch ( type )
		{
			case "string":
			{
				if ( field.length < min )
				{
					return [key, `Must be at least ${min} character(s).`];
				}

				if ( field.length > max )
				{
					return [key, `Cannot be more than ${max} character(s).`];
				}

				if ( typeof field !== "string" )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof field}\``];
				}

				break;
			}

			case "number":
			case "integer":
			{
				if ( field < min )
				{
					return [key, `Must be at least ${min}.`];
				}

				if ( field > max )
				{
					return [key, `Cannot be more than ${max}.`];
				}

				if ( (type === "integer" && !Number.isInteger (field)) || typeof field !== "number" )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof field}\``];
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
