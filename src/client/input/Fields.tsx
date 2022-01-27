import React from "react";

import Textbox from "./Textbox";
import IntegerDropdown from "./IntegerDropdown";

import { AnyObject } from "../../common/util/types";


type FieldsProps =
{
	keyPrefix: string,
	fields: AnyObject,
	onChange: Function,
};

const Fields = ( props: FieldsProps ) =>
{
	const { keyPrefix, fields, onChange } = props;

	return (
		<div>
		{
			Object.keys (fields).map (key =>
			{
				const field = fields[key];

				let input = <span>"Unknown field type"</span>;

				switch ( field.type )
				{
					case "string":
					{
						input = <Textbox
							key={`${keyPrefix}-${field.type}-${key}`}
							field={field}
							onChange={event => onChange (event, key, field)}
						/>;

						break;
					}

					case "integer":
					{
						input = <IntegerDropdown
							key={`${keyPrefix}-${field.type}-${key}`}
							field={field}
							onChange={event => onChange (event, key, field)}
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
					<div>
						<label>{field.displayName}: </label>
						{input}
					</div>
				);
			})
		}
		</div>
	);
};


export default Fields;

export { FieldsProps }
