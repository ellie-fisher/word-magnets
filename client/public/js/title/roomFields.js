/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $, $button, $field } from "../framework.js";
import { validateField } from "../util.js";

export const RoomFields = (data = {}) => {
	const {
		fields = [],
		title = "Default Title Text",
		buttonText = "Default Button Text",
		onButtonClick = userData => {},
	} = data;

	let waiting = false;

	const userData = {};
	const button = $button(buttonText, "primary", ({ target }) => {
		waiting = true;
		target.disabled = true;
		onButtonClick(userData);
	});

	const updateButton = () => {
		button.disabled =
			waiting || !fields.every(field => validateField(field, userData[field.id] ?? field.default ?? ""));
	};

	updateButton();

	return $(
		"section",
		{ className: "container" },

		$("h2", title),

		...fields.map(field => {
			userData[field.id] = field.default ?? "";

			return $(
				"div",
				{ className: "field-row" },
				$("div", $("strong", `${field.label}`)),
				" ",
				$field(field, ({ target }) => {
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
