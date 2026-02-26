/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $ } from "../framework.js";
import { Button, Div, Field, H2, Section, Strong } from "../util/components.js";
import { validateField } from "../util/util.js";

export const RoomFields = (data = {}) => {
	const {
		fields = [],
		title = "Default Title Text",
		buttonText = "Default Button Text",
		onButtonClick = userData => {},
	} = data;

	let waiting = false;

	const userData = {};
	const button = Button(buttonText, "primary", ({ target }) => {
		waiting = true;
		target.disabled = true;
		onButtonClick(userData);
	});

	const updateButton = () => {
		button.disabled =
			waiting || !fields.every(field => validateField(field, userData[field.id] ?? field.default ?? ""));
	};

	updateButton();

	return Section(
		{ className: "container" },

		H2(title),

		...fields.map(field => {
			userData[field.id] = field.default ?? "";

			return Div(
				{ className: "field-row" },
				Div(Strong(`${field.label}`)),
				" ",
				Field(field, ({ target }) => {
					if (field.type === "STRING") {
						target.value = target.value.toUpperCase();
					}

					if (field.type.toLowerCase() === "string") {
						target.value = target.value.replaceAll(/[\x09]/g, " ");
						target.value = target.value.replaceAll(/[^ -)+-~]/g, "");
					}

					userData[field.id] = target.value;
					updateButton();
				}),
			);
		}),

		button,
	);
};
