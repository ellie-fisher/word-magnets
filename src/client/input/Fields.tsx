import React from "react";

import Textbox from "./Textbox";
import IntegerDropdown from "./IntegerDropdown";

import { AnyObject } from "../../common/util/types";


type FieldsProps =
{
	keyPrefix: string,
	fields: AnyObject,
	error: any[] | string,
	onChange: Function,
};

const Fields = ( props: FieldsProps ) =>
{
	const { keyPrefix, fields, error, onChange } = props;

	return (
		<div>
		{
			Object.keys (fields).map (key =>
			{
				const field = fields[key];

				let input = <span>Unknown field type</span>;

				switch ( field.type )
				{
					case "string":
					{
						input = <Textbox
							field={field}
							onChange={event => onChange (event.target.value, key, field)}
						/>;

						break;
					}

					case "integer":
					{
						input = <IntegerDropdown
							field={field}
							onChange={event => onChange (Number (event.target.value), key, field)}
						/>;

						break;
					}

					default:
					{
						input = <span>`Unsupported field type \`${field.type}\``</span>;
						break;
					}
				}

				return (
					<div key={`${keyPrefix}-${field.type}-${key}`}>
						<label>{field.displayName}: </label>
						{input}
						{error !== "" && error[0] === key ? <div><strong>{error[1]}</strong></div> : ""}
					</div>
				);
			})
		}
		</div>
	);
};


export default Fields;

export { FieldsProps }
