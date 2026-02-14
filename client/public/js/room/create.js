/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $, $replace, createEffect } from "../framework.js";
import { flagFixed, flagPlayer } from "../util.js";
import { getWords } from "./state.js";

const Wordbank = wordbank => {
	return $(
		"p",
		{ className: "wordbank" },
		...wordbank.words.map(word =>
			$(
				"button",
				{ className: "word-tile" + (wordbank.flags & flagPlayer ? " player" : "") },
				word === " " ? "\u00A0" : word,
			),
		),
	);
};

export const Create = (data = {}) => {
	const body = $("section");

	createEffect(() => {
		const wordbanks = getWords();
		const fixed = [];
		const nonfixed = [];

		wordbanks.forEach(bank => (bank.flags & flagFixed ? fixed : nonfixed).push(Wordbank(bank)));

		$replace(body, ...nonfixed, ...fixed);
	});

	return body;
};
