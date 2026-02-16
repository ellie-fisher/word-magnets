/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace } from "../framework.js";
import { RoomWords, Sentence } from "./state.js";
import { flagFixed, flagPlayer, onRelease } from "../util.js";
import { MAX_LENGTH, sentenceToString } from "./sentences.js";

const addWordToSentence = word => {
	const oldSentence = Sentence.get();
	const newSentence = { ...oldSentence, words: [...oldSentence.words, word] };
	const [success, string, singleHyphens] = sentenceToString(newSentence.words, RoomWords.get());

	if (success) {
		newSentence.string = string;
		newSentence.length = string.length + singleHyphens;
		Sentence.set(newSentence);
	}
};

export const Create = createSingletonView(() => {
	const spacer = $("button", { className: "word-tile hidden" }); // Spacer so sentence maintains its height.
	const nonfixed = $("section");
	const sentence = $("section", { className: "sentence" }, spacer);
	const sentenceLen = $("small", `${Sentence.get().length} / ${MAX_LENGTH}`);
	const fixed = $("section");

	RoomWords.addHook(wordbanks => {
		$replace(fixed);
		$replace(nonfixed);

		wordbanks.forEach(bank =>
			(bank.flags & flagFixed ? fixed : nonfixed).append(
				$(
					"p",
					{ className: "wordbank" },
					...bank.words.map((word, wordIndex) =>
						$(
							"button",
							{
								className: "word-tile" + (bank.flags & flagPlayer ? " player" : ""),
								...onRelease(() => addWordToSentence({ bankIndex: bank.index, wordIndex })),
							},
							word === " " ? "\u00A0" : word,
						),
					),
				),
			),
		);
	});

	Sentence.addHook(({ words = [], string = "", length = 0 }) => {
		const wordbanks = RoomWords.get();

		if (words.length <= 0) {
			$replace(sentence, spacer);
		} else {
			$replace(sentenceLen, `${length} / ${MAX_LENGTH}`);
			$replace(
				sentence,
				...words.map(({ bankIndex, wordIndex }) => {
					const word = wordbanks[bankIndex].words[wordIndex];

					return $("button", { className: "word-tile" }, word === " " ? "\u00A0" : word);
				}),
				$("p", Sentence.get().string),
			);
		}
	});

	return $("section", nonfixed, sentence, $("p", sentenceLen), fixed);
});
