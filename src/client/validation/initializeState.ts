import has from "../../common/util/has";
import { AnyObject } from "../../common/util/types";


/**
 * For initializing reducer states that use fields.
 */
const initializeState = <T>( validation: AnyObject, onlyValues: boolean = false ): T =>
{
	const state = {} as T;
	const keys = Object.keys (validation);

	keys.forEach (( key: string ) =>
	{
		const field = validation[key];

		let value;

		if ( has (field, "defaultValue") )
		{
			value = field.defaultValue;
		}
		else if ( field.type === "string" )
		{
			value = "";
		}
		else if ( field.type === "boolean" )
		{
			value = true;
		}
		else if ( field.type === "integer" || field.type === "number" )
		{
			value = 0;
		}
		else
		{
			throw new Error (`Error initializing state for field \`${key}\``);
		}

		if ( onlyValues )
		{
			state[key] = value;
		}
		else
		{
			state[key] =
			{
				...field,
				value,
			};
		}
	});

	return state;
};


export default initializeState;
