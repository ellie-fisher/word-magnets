/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createElement, combineElements } from "./framework.js";

export const createMessage = (...children) => {
	return combineElements("div", { className: "loading" }, combineElements("div", ...children));
};

export const createErrorMessage = (title = "Error: ", message = "Unknown error", ...children) => {
	return createMessage(
		createElement("strong", { className: "error" }, title),
		createElement("br"),
		message,
		...children,
	);
};
