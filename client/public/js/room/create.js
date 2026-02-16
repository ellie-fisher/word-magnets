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
	const [string, length] = sentenceToString(newSentence.words, RoomWords.get());

	if (length <= MAX_LENGTH) {
		newSentence.string = string;
		newSentence.length = length;

		Sentence.set(newSentence);
	}
};

export const Create = createSingletonView(() => {
	const spacer = $("button", { className: "word-tile hidden" }); // Spacer so sentence maintains its height.
	const nonfixed = $("section");
	const sentence = $("section", { className: "sentence" }, spacer);
	const sentenceLen = $("small");
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

	Sentence.addHook(({ words = [], string = "\u00A0", length = 0 }) => {
		$replace(sentenceLen, $("strong", "Length: "), `${length} / ${MAX_LENGTH}`);

		if (words.length <= 0) {
			$replace(sentence, spacer, $("p", string === "" ? "\u00A0" : string));
		} else {
			const wordbanks = RoomWords.get();

			$replace(
				sentence,
				...words.map(({ bankIndex, wordIndex }) => {
					const word = wordbanks[bankIndex].words[wordIndex];

					return $("button", { className: "word-tile" }, word === " " ? "\u00A0" : word);
				}),
				$("p", string === "" ? "\u00A0" : string),
			);
		}
	});

	Sentence.set(Sentence.get());

	return $("section", nonfixed, sentence, $("p", sentenceLen), fixed);
});
