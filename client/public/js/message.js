/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { setAppView } from "./app.js";
import { $ } from "./framework.js";
import { onRelease } from "./util.js";

export const $message = (...children) => {
	return $("div", { className: "loading" }, $("div", ...children));
};

export const $error = (data = {}, ...children) => {
	const { title = "Error: ", message = "Unknown error", showButton = true, socket = null } = data;

	return $message(
		$("strong", { className: "error" }, title),
		$("br"),
		message,
		...children,
		showButton
			? $("button", { className: "primary", ...onRelease(() => setAppView("title", { socket })) }, "Okay")
			: "",
	);
};
