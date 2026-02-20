/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $button, $replace, $getAll } from "../framework.js";
import { RoomStates, RoomData, RoomWords, Sentence, setSentence } from "./state.js";
import { flagFixed, flagPlayer } from "../util.js";
import { MAX_LENGTH } from "./sentences.js";

const addWord = word => setSentence({ ...Sentence.get(), words: [...Sentence.get().words, word] });

const removeWord = index => {
	const sentence = { ...Sentence.get(), words: [...Sentence.get().words] };

	sentence.words.splice(index, 1);

	return setSentence(sentence);
};

export const Create = createSingletonView(() => {
	const spacer = $button("\u00A0", "word-tile hidden"); // Spacer so sentence maintains its height.
	const nonfixed = $("section");
	const sentence = $("section", { className: "sentence" }, spacer);
	const sentenceLen = $("p");
	const fixed = $("section");

	let shakeTimeout = 0;

	RoomWords.addHook(() => {
		$replace(fixed);
		$replace(nonfixed);

		RoomWords.get().forEach(bank =>
			(bank.flags & flagFixed ? fixed : nonfixed).append(
				$(
					"p",
					{ className: "wordbank" },
					...bank.words.map((word, wordIndex) =>
						$button(
							word === " " ? "\u00A0" : word,
							"word-tile" + (bank.flags & flagPlayer ? " player" : ""),
							() => {
								if (!addWord({ bankIndex: bank.index, wordIndex })) {
									if (shakeTimeout === 0) {
										/* This is kinda hacky and I apologize. */

										$getAll("button.word-tile").forEach(
											tile => (tile.style.animation = "brief-shake 0.3s linear 1"),
										);

										shakeTimeout = setTimeout(() => {
											shakeTimeout = 0;
											$getAll("button.word-tile").forEach(tile => (tile.style.animation = ""));
										}, 300);
									}
								}
							},
						),
					),
				),
			),
		);
	});

	RoomData.state.addHook(state => {
		$getAll("button.word-tile").forEach(tile => (tile.disabled = state === RoomStates.CreateSubmit));
	});

	Sentence.addHook(({ words = [], string = "\u00A0", length = 0 }) => {
		$replace(sentenceLen, $("span", $("strong", "Length: "), `${length} / ${MAX_LENGTH}`));

		if (words.length <= 0) {
			$replace(sentence, spacer, $("p", string === "" ? "\u00A0" : string));
		} else {
			const wordbanks = RoomWords.get();

			$replace(
				sentence,
				...words.map(({ bankIndex, wordIndex }, sentenceIndex) => {
					const word = wordbanks[bankIndex].words[wordIndex];
					return $button(word === " " ? "\u00A0" : word, "word-tile", () => removeWord(sentenceIndex));
				}),
				$("p", string === "" ? "\u00A0" : string),
			);
		}
	});

	return $(
		"section",
		nonfixed,
		// $("p", "(Tip: You can type on your keyboard to quickly search for words.)"),
		// TODO: ^^^ Implement this ^^^
		sentence,
		sentenceLen,
		fixed,
	);
});
