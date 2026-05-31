/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $ } from "../framework.js";

export const Article = (...args) => $("article", ...args);
export const Section = (...args) => $("section", ...args);
export const H1 = (...args) => $("h1", ...args);
export const H2 = (...args) => $("h2", ...args);
export const P = (...args) => $("p", ...args);
export const Div = (...args) => $("div", ...args);
export const Span = (...args) => $("span", ...args);
export const Strong = (...args) => $("strong", ...args);
export const Em = (...args) => $("em", ...args);

/**
 * Creates an element from field data.
 */
export const Field = (field, userData, userOnChange = () => {}) => {
	switch (field.type) {
		case "STRING":
		case "string": {
			let show = false;

			const onchange = event => {
				let { value } = event.target;

				if (field.type === "STRING") {
					value = value.toUpperCase();
				}

				if (field.type.toLowerCase() === "string") {
					value = value.replaceAll(/\s+/g, " ");
					value = value.replaceAll(field.password ? /[^ -)+-~•]/g : /[^ -)+-~]/g, "");
				}

				let userValue;

				if (field.password) {
					userValue = "";

					for (let i = 0; i < value.length; i++) {
						let ch = value[i];

						if (ch !== "•") {
							userValue += ch;
						} else if (i < userData[field.id].length) {
							userValue += userData[field.id][i];
						}
					}

					if (!show) {
						value = value.replaceAll(/./g, "•");
					}
				} else {
					userValue = value;
				}

				userData[field.id] = userValue;
				event.target.value = value;

				userOnChange(event);
			};

			const textbox = $("input", {
				type: "text",
				minLength: field.min,
				maxLength: field.max,
				onchange,
				oninput: onchange,
				oncopy(event) {
					event.clipboardData.setData("text/plain", userData[field.id]);
					event.preventDefault();
				},
			});

			if (field.type === "STRING") {
				textbox.autocapitalize = "characters";
			}

			let element = textbox;

			if (field.password) {
				element = Span(
					textbox,
					Button("Show", {
						className: "dark",
						onclick() {
							show = !show;
							textbox.value = show ? userData[field.id] : userData[field.id].replaceAll(/./g, "•");
						},
					}),
				);
			}

			return element;
		}

		case "int": {
			const onchange = event => {
				userData[field.id] = event.target.value;
				userOnChange(event);
			};

			const increments = field.increments ?? 1;
			const dropdown = $("select", { onchange });

			for (let i = field.min; i <= field.max; i += increments) {
				dropdown.append($("option", { value: i, selected: i === field.default }, i));
			}

			return dropdown;
		}

		default:
			return null;
	}
};

/**
 * @param {string} text
 * @param {...} args
 *
 * @returns {HTMLButtonElement}
 */
export const Button = (text, ...args) => {
	let attributes = {};

	args.forEach((arg, i) => {
		if (typeof arg === "function") {
			attributes.onclick = arg;
		} else if (typeof arg === "string") {
			attributes.className = arg;
		} else if (typeof arg === "object") {
			attributes = { ...attributes, ...arg };
		}
	});

	return $("button", attributes, text);
};
