/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const RoomFieldsFragment = (data = {}, ...children) => {
	const { fields = [], onFieldChange = (field, value) => {} } = data;
	const fieldElements = [];

	fields.forEach(field => {
		let input = "";

		field.value = field.default

		const onChange = event => {
			const oldValue = field.value;
			field.value = event.target.value;
			onFieldChange(field, oldValue);
		};

		switch(field.type) {
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
					options.push(createElement("option", { value: i, selected: i === field.default }, i));
				}

				input = createElement("select", { onchange: onChange });
				input.append(...options);

				break;
			}

			default:
				break;
		}

		fieldElements.push(
			combineElements("div",
				combineElements("div", createElement("strong", `${field.label}`)), " ", input
			),
		);
	});

	const section = createElement("section", { className: "room-fields" });

	section.append(...fieldElements, ...children);

	return section;
}