/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { combineElements, createButton, createElement, createFromField } from "../framework.js";
import { validateField } from "../util.js";

export const RoomFieldsView = (data = {}, ...children) => {
	const {
		fields = [],
		title = "Default Title Text",
		socket = null,
		buttonText = "Default Button Text",
		onButtonClick = (socket, userData) => {},
	} = data;

	let waiting = false;

	const userData = {};

	const button = createButton(
		buttonText,
		"primary",
		({ target }) => {
			waiting = true;
			target.disabled = true;
			onButtonClick(socket, userData);
		},
		{ disabled: true },
	);

	return combineElements(
		"section",
		{ className: "room-fields" },

		createElement("h2", title),

		...fields.map(field => {
			userData[field.id] = field.default ?? "";

			return combineElements(
				"div",
				{ className: "field-row" },
				combineElements("div", createElement("strong", `${field.label}`)),
				" ",
				createFromField(field, ({ target }) => {
					userData[field.id] = target.value;
					button.disabled =
						waiting || !fields.every(field => validateField(field, userData[field.id]));
				}),
			);
		}),

		...children,
		button,
	);
};
