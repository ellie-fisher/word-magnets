/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const MessageView = (data = {}, ...children) => {
	return combineElements("div", { className: "loading" }, combineElements("div", ...children));
};

const ErrorMessageView = (data = { title: "Error:", message: "Unknown error" }, ...children) => {
	return MessageView(
		null,
		createElement("strong", { className: "error" }, data.title),
		createElement("br"),
		data.message,
		...children,
	);
};
