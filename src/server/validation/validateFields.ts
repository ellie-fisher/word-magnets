import has from "../../common/util/has";

import slurFilter from "../config/slurFilter";

import { ValidationResult } from "../../common/validation/types";
import { AnyObject } from "../../common/util/types";
import { checkFilter } from "../../common/util/wordFilters";

import invalidChars from "../../common/config/invalidChars";


const validateFields = ( fields: object, validation: object ): ValidationResult =>
{
	if ( typeof fields !== "object" )
	{
		return [false, `Expected fields to be an object, got \`${typeof fields}\``];
	}

	const keys: string[] = Object.keys (validation);

	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key: string = keys[i];
		const data: AnyObject = validation[key];

		const { type, min, max } = data;

		if ( !has (fields, key) )
		{
			if ( has (data, "defaultValue") )
			{
				continue;
			}

			return [false, [key, "Missing required field"]];
		}

		const value: any = fields[key];

		switch ( type )
		{
			case "string":
			{
				if ( typeof value !== "string" )
				{
					return [false, [key, `Expected type \`${type}\`, got \`${typeof value}\``]];
				}

				if ( value.length < min )
				{
					return [false, [key, `Must be at least ${min} character(s)`]];
				}

				if ( value.length > max )
				{
					return [false, [key, `Cannot be more than ${max} character(s)`]];
				}

				if ( checkFilter (value, slurFilter) )
				{
					return [false, [key, "Failed offensive word filter"]];
				}

				if ( !data.trailingSpaces && (value[0] === " " || value[value.length - 1] === " ") )
				{
					return [false, [key, "Trailing spaces are not allowed"]];
				}

				if ( !data.repeatSpaces && value.indexOf ("  ") >= 0 )
				{
					return [false, [key, "Repeat spaces are not allowed"]];
				}

				if ( value.match (new RegExp (invalidChars)) !== null )
				{
					return [false, [key, "Contains invalid character(s)"]];
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
					return [false, [key, `Expected type \`${type}\`, got \`${typeof value}\``]];
				}

				if ( value < min )
				{
					return [false, [key, `Must be at least ${min}`]];
				}

				if ( value > max )
				{
					return [false, [key, `Cannot be more than ${max}`]];
				}

				break;
			}

			case "boolean":
			{
				if ( typeof value !== "boolean" && value !== 0 && value !== 1 )
				{
					return [false, [key, `Expected type \`${type}\`, got \`${typeof value}\``]];
				}

				break;
			}

			default:
			{
				throw new Error (`Unhandled/Unknown type \`${type}\``);
			}
		}
	}

	return [true];
};


export default validateFields;
