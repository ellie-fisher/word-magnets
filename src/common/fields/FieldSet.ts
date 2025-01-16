import { Field, FieldValidationResult } from "./Field";
import { AnyObject } from "../util";

export class FieldSet
{
	#fields: { [key: string]: Field<string | number> };

	constructor(fields: { [key: string]: Field<string | number> } = {})
	{
		this.#fields = Object.freeze(fields);
	}

	public get fields(): { [key: string]: Field<string | number> } { return this.#fields; }

	public validate(values: AnyObject): [FieldValidationResult, string?]
	{
		const fields = this.#fields;
		const keys = Object.keys(fields);
		const { length } = keys;

		for (let i = 0; i < length; i++)
		{
			const key = keys[i];
			const field = fields[key];

			if (!Object.hasOwn(values, key))
			{
				if (!field.hasDefault)
				{
					return [FieldValidationResult.Required, key];
				}

				values[key] = field.default;
			}

			const result = field.validate(values[key]);

			if (result !== FieldValidationResult.Success)
			{
				return [result, key];
			}
		}

		return [FieldValidationResult.Success];
	}
};
