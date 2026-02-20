/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $ } from "../framework.js";

export const Table = (headers = [], ...rows) => {
	const tableHeaders = headers.map(([text = "", width = ""]) => {
		const attributes = { scope: "colspan" };

		if (width !== "") {
			attributes.style = { width };
		}

		return $("th", attributes, text);
	});

	const tableRows = rows.map((row = []) => {
		let attributes = {};
		let entries = row;

		if (row.length >= 2 && typeof row[0] === "object") {
			attributes = row[0];
			entries = row[1];
		}

		return $("tr", attributes, ...entries.map(entry => $("td", { className: "table-entry" }, entry)));
	});

	return $("table", { className: "table" }, $("tr", ...tableHeaders), ...tableRows);
};
