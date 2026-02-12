/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $, $replace, createEffect } from "../framework.js";
import { getWords } from "./state.js";

export const Create = (data = {}) => {
	const body = $("section");

	createEffect(() => {
		const wordbanks = getWords().map(bank =>
			$(
				"p",
				{ className: "wordbank" },
				...bank.map(word => $("button", { className: "word-tile" }, word === " " ? "\u00A0" : word)),
			),
		);

		$replace(body, ...wordbanks);
	});

	return body;
};
