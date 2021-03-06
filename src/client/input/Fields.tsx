import React from "react";
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
		<table>
			<thead>
				<tr>
				{
					Object.keys (fields).map (key =>
					{
						const field = fields[key];

						return <th className="field" key={`${keyPrefix}-header-${field.type}-${key}`}>
							<label>{field.displayName}: </label>
						</th>;
					})
				}
				</tr>
			</thead>

			<tbody>
				<tr>
				{
					Object.keys (fields).map (key =>
					{
						const field = fields[key];

						let input = <span>Unknown field type</span>;

						switch ( field.type )
						{
							case "string":
							{
								input = <input
									type="text"
									maxLength={field.max || null}
									value={field.value}
									onChange={event => onChange (event.target.value, key, field)}
								/>;

								break;
							}

							case "integer":
							{
								input = <IntegerDropdown
									field={field}
									onChange={option => onChange (Number (option.value), key, field)}
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
							<td className="field" key={`${keyPrefix}-${field.type}-${key}`}>
								<div style={{ float: "left" }}>
									{input}
								</div>

								<div style={{ float: "left", width: "100%", textAlign: "left" }}>
									<strong className="error-message">
										{error.length > 1 && error[0] === key ? error[1] : ""}
									</strong>
								</div>
							</td>
						);
					})
				}
				</tr>
			</tbody>
		</table>
	);
};


export default Fields;

export { FieldsProps }
