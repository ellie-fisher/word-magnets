import has from "../../common/util/has";


// TODO: Test for invalid characters (https://github.com/textlint-rule/textlint-rule-no-invalid-control-character/blob/master/src/CONTROL_CHARACTERS.js)

const validateFields = ( fields: object, validation: object ): any[] =>
{
	const keys: string[] = Object.keys (validation);

	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key: string = keys[i];
		const data: any = validation[key];

		const { type, min, max } = data;

		if ( !has (fields, key) )
		{
			if ( has (data, "defaultValue") )
			{
				continue;
			}

			return [key, "Missing required field"];
		}

		const value: any = fields[key];

		switch ( type )
		{
			case "string":
			{
				if ( typeof value !== "string" )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof value}\``];
				}

				if ( value.length < min )
				{
					return [key, `Must be at least ${min} character(s)`];
				}

				if ( value.length > max )
				{
					return [key, `Cannot be more than ${max} character(s)`];
				}

				break;
			}

			case "number":
			case "integer":
			{
				if ( (type === "integer" && !Number.isInteger (value))
					|| typeof value !== "number"
					|| isNaN (value) )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof value}\``];
				}

				if ( value < min )
				{
					return [key, `Must be at least ${min}`];
				}

				if ( value > max )
				{
					return [key, `Cannot be more than ${max}`];
				}

				break;
			}

			case "boolean":
			{
				if ( typeof value !== "boolean" && value !== 0 && value !== 1 )
				{
					return [key, `Expected type \`${type}\`, got \`${typeof value}\``];
				}

				break;
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
