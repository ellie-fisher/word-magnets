/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
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
export const Field = (field, onchange = () => {}) => {
	switch (field.type) {
		case "STRING":
		case "string": {
			const textbox = $("input", {
				type: "text",
				minLength: field.min,
				maxLength: field.max,
				onchange,
				oninput: onchange,
			});

			if (field.type === "STRING") {
				textbox.autocapitalize = "characters";
			}

			return textbox;
		}

		case "int": {
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
