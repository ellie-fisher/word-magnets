/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $ } from "./framework.js";
import { AppView } from "./app/state.js";
import { Button, Div, P, Strong } from "./util/components.js";

export const Message = (...children) => {
	return Div({ className: "message" }, Div(...children));
};

export const Error = (data = {}, ...children) => {
	const { title = "Error: ", message = "Unknown error", showOK = false } = data;

	return Message(
		Strong({ className: "error" }, title),
		$("br"),
		message,
		...children,
		showOK
			? P(
					{ className: "popup-buttons" },
					Button("OK", { className: "primary" }, () => AppView.set("title")),
				)
			: "",
	);
};
