import Packet from "./Packet";
import has from "../util/has";

import { ValidationResult } from "../validation/types";


const validatePacket = ( packet: Packet, fields ): ValidationResult =>
{
	const { body } = packet;

	if ( typeof body !== "object" || body === null )
	{
		return [
			false,
			`Expected packet body to be an object, got \`${body === null ? "null" : typeof body}\``
		];
	}

	const keys = Object.keys (fields);
	const { length } = keys;

	for ( let i = 0; i < length; i++ )
	{
		const key = keys[i];
		const field = fields[key];

		if ( !has (body, key) && field.required )
		{
			return [false, [key, "Missing required field"]];
		}

		const { type } = field;
		const value = body[key];

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
			return [false, [key, `Expected type \`${type}\`, got \`${valueType}\``]];
		}
	}

	return [true];
};


export default validatePacket;
