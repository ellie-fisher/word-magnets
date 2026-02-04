/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const RoomFieldsFragment = (data = {}, ...children) => {
	const { fields = [], title = "", onFieldChange = (field, value) => {} } = data;
	const fieldElements = [];

	fields.forEach(field => {
		let input = "";

		field.value = field.default;

		const onChange = event => {
			const oldValue = field.value;
			field.value = event.target.value;
			onFieldChange(field, oldValue);
		};

		switch (field.type) {
			case "string": {
				input = createElement("input", {
					type: "text",
					minLength: field.min,
					maxLength: field.max,
					oninput: onChange,
					onchange: onChange,
				});

				break;
			}

			case "int": {
				const increments = field.increments ?? 1;
				const options = [];

				for (let i = field.min; i <= field.max; i += increments) {
					options.push(
						createElement("option", { value: i, selected: i === field.default }, i),
					);
				}

				input = createElement("select", { onchange: onChange });
				input.append(...options);

				break;
			}

			default:
				break;
		}

		fieldElements.push(
			combineElements(
				"div",
				{ className: "field-row" },
				combineElements("div", createElement("strong", `${field.label}`)),
				" ",
				input,
			),
		);
	});

	return combineElements(
		"section",
		{ className: "room-fields" },
		createElement("h2", title),
		...fieldElements,
		...children,
	);
};
