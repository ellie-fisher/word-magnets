import Packet from "./Packet";
import has from "../util/has";

import { AnyObject } from "../util/types";
import { ValidationResult } from "../validation/types";


const validateType = ( value: any, type: string, key: string = "" ): ValidationResult =>
{
	let isTypeValid = true;
	let valueType: any = typeof value;

	switch ( type )
	{
		case "string":
		{
			isTypeValid = valueType === "string";
			break;
		}

		case "number":
		case "integer":
		{
			isTypeValid = !isNaN (value) && valueType === "number";

			if ( type === "integer" )
			{
				isTypeValid &&= type === "integer" && Number.isInteger (value);
			}

			break;
		}

		case "boolean":
		{
			isTypeValid = valueType === "boolean" || value === 0 || value === 1;
			break;
		}

		case "object":
		{
			isTypeValid = valueType === "object" && !Array.isArray (value) && value !== null;
			valueType = value === null ? "null" : valueType;
			break;
		}

		case "array":
		{
			isTypeValid = Array.isArray (value);
			break;
		}

		default:
		{
			throw new Error (`Unhandled/Unknown type \`${type}\``);
		}
	}

	if ( !isTypeValid )
	{
		const error = `Expected type \`${type}\`, got \`${valueType}\``;

		if ( key === "" )
		{
			return [false, error];
		}

		return [false, [key, error]];
	}

	return [true];
};

const validatePacket = ( packet: Packet, fieldsOrType: AnyObject | string ): ValidationResult =>
{
	const { body } = packet;

	if ( typeof body !== "object" || body === null )
	{
		return [
			false,
			`Expected packet body to be an object, got \`${body === null ? "null" : typeof body}\``
		];
	}

	if ( typeof fieldsOrType === "string" )
	{
		return validateType (body, fieldsOrType);
	}

	const keys = Object.keys (fieldsOrType);
	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key = keys[i];
		const field = fieldsOrType[key];

		if ( !has (body, key) && field.required )
		{
			return [false, [key, "Missing required field"]];
		}

		const { type } = field;
		const value = body[key];
		const result = validateType (value, type, key);

		if ( !result[0] )
		{
			return result;
		}
	}

	return [true];
};


export default validatePacket;
