/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import {
	createSingletonView,
	$,
	$button,
	$replace,
	$getAll,
	getElementCenter,
	isWithinBounds,
	createState,
} from "../framework.js";

import { RoomStates, RoomData, RoomWords, UserSentence, setSentence } from "./state.js";
import { flagFixed, hasIndex } from "../util.js";
import { MAX_LENGTH } from "./sentences.js";

export const Create = createSingletonView(() => {
	const MOUSE_LEFT = 1 << 0;

	const sentence = {
		body: $("section", { className: "sentence" }),
		length: $("p"),
		spacer: $button("\u00A0", "word-tile hidden"),
		shakeTimeout: 0,

		// Adds a word to the sentence.
		addWord(word, index = Infinity) {
			const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };

			if (index === Infinity) {
				sentence.words.push(word);
			} else if (hasIndex(sentence.words, index)) {
				sentence.words.splice(index, 0, word);
			}

			return setSentence(sentence);
		},

		// Removes a word from the sentence.
		removeWord(index) {
			const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };
			sentence.words.splice(index, 1);
			return setSentence(sentence);
		},

		// Shake tiles when you cannot add a new word to the sentence. This is kinda hacky but oh well.
		shakeTiles() {
			if (sentence.shakeTimeout === 0) {
				$getAll("button.word-tile").forEach(tile => (tile.style.animation = "brief-shake 0.3s linear 1"));

				sentence.shakeTimeout = setTimeout(() => {
					sentence.shakeTimeout = 0;
					$getAll("button.word-tile").forEach(tile => (tile.style.animation = ""));
				}, 300);
			}
		},
	};

	const wordbanks = { nonfixed: $("section"), fixed: $("section") };

	// Everything related to dragging tiles.
	const drag = {
		tiles: [],
		firstPressed: { x: 0, y: 0, tile: null },
		selected: { bankIndex: -1, wordIndex: -1, tile: null },

		// The gap that appears between tiles when dragging a tile in(to) a sentence.
		spacer: createState({ bankIndex: -1, wordIndex: -1, sentenceIndex: -1 }),

		// Tile that appears when dragging another word tile.
		tile: $button("", "word-tile hidden", {
			style: { position: "absolute", "z-index": 10, left: "0px", top: "0px" },
		}),

		start(bankIndex, wordIndex, tile) {
			drag.tile.textContent = tile.textContent;
			drag.tile.style.transition = "";
			drag.tile.classList.remove("hidden");
			drag.selected = { bankIndex, wordIndex, tile };
		},

		stop() {
			const { sentenceIndex } = drag.spacer.get();
			let fade = 0;

			if (sentenceIndex >= 0) {
				const { bankIndex, wordIndex } = drag.selected;

				if (!sentence.addWord({ bankIndex, wordIndex }, sentenceIndex)) {
					fade = 0.5;
					sentence.shakeTiles();
				}
			} else {
				fade = 0.25;
			}

			if (fade > 0) {
				drag.tile.style.transition = `visibility ${fade}s, opacity ${fade}s`;
			}

			drag.spacer.reset();
			drag.selected = { bankIndex: -1, wordIndex: -1, tile: null };
			drag.firstPressed = { x: 0, y: 0, tile: null };
			drag.tile.classList.add("hidden");
		},

		move(x, y) {
			const { tile } = drag;

			tile.style.left = `${x - drag.firstPressed.x}px`;
			tile.style.top = `${y - drag.firstPressed.y}px`;

			const { left, right, top, bottom } = sentence.body.getBoundingClientRect();
			const bounds = { left: left - tile.offsetWidth, right: right + tile.offsetWidth, top, bottom };

			if (!isWithinBounds(tile, bounds)) {
				drag.spacer.reset();
			} else {
				let right = null;
				let sentenceIndex = Infinity;

				for (let i = 0; i < drag.tiles.length && right === null; i++) {
					const sentenceTile = drag.tiles[i];
					const center = getElementCenter(sentenceTile);

					if (center.x >= x) {
						right = sentenceTile;
						sentenceIndex = i;
					}

					// TODO: Account for Y coord as well
				}

				drag.spacer.set({
					bankIndex: drag.selected.bankIndex,
					wordIndex: drag.selected.wordIndex,
					sentenceIndex,
				});
			}
		},
	};

	document.addEventListener("pointermove", event => {
		if (drag.selected.tile !== null) {
			drag.move(event.pageX, event.pageY, true);
		}
	});

	document.addEventListener("pointerup", event => {
		if (drag.selected.tile !== null) {
			drag.stop(event.pageX, event.pageY);
		}
	});

	const Tile = (bankIndex, wordIndex, sentenceIndex = -1) => {
		const bank = RoomWords.get()[bankIndex];
		const word = bank.words[wordIndex];

		return $button(
			word === " " ? "\u00A0" : word,
			"word-tile",
			() => {
				if (sentenceIndex >= 0) {
					sentence.removeWord(sentenceIndex);
				} else if (!sentence.addWord({ bankIndex, wordIndex })) {
					sentence.shakeTiles();
				}
			},
			{
				onpointerdown({ offsetX, offsetY, target }) {
					drag.firstPressed = { x: offsetX, y: offsetY, tile: target };
				},

				onpointermove({ target, buttons }) {
					if (target === drag.firstPressed.tile && buttons & MOUSE_LEFT) {
						drag.start(bankIndex, wordIndex, target);

						if (sentenceIndex >= 0) {
							sentence.removeWord(sentenceIndex);
						}
					}
				},
			},
		);
	};

	// The gap that appears between tiles when dragging a tile in(to) a sentence.
	const Spacer = (bankIndex, wordIndex) => {
		const bank = RoomWords.get()[bankIndex];
		const word = bank.words[wordIndex];

		return $button(word === " " ? "\u00A0" : word, "word-tile hidden");
	};

	RoomWords.addHook(() => {
		const { fixed, nonfixed } = wordbanks;

		$replace(fixed);
		$replace(nonfixed);

		RoomWords.get().forEach(bank =>
			(bank.flags & flagFixed ? fixed : nonfixed).append(
				$("p", { className: "wordbank" }, ...bank.words.map((_, wordIndex) => Tile(bank.index, wordIndex))),
			),
		);
	});

	RoomData.state.addHook(state => {
		$getAll("button.word-tile").forEach(tile => (tile.disabled = state === RoomStates.CreateSubmit));
	});

	const updateSentenceHook = () => {
		const { words = [], string = "\u00A0", length = 0 } = UserSentence.get();

		$replace(sentence.length, $("span", $("strong", "Length: "), `${length} / ${MAX_LENGTH}`));

		if (words.length <= 0) {
			$replace(sentence.body, sentence.spacer, $("p", string === "" ? "\u00A0" : string));
		} else {
			drag.tiles = words.map(({ bankIndex, wordIndex }, sentenceIndex) => {
				return Tile(bankIndex, wordIndex, sentenceIndex);
			});

			const tiles = [...drag.tiles];
			const dragSpacer = drag.spacer.get();

			if (dragSpacer.sentenceIndex >= 0) {
				tiles.splice(dragSpacer.sentenceIndex, 0, Spacer(dragSpacer.bankIndex, dragSpacer.wordIndex));
			}

			$replace(sentence.body, ...tiles, $("p", string === "" ? "\u00A0" : string));
		}
	};

	UserSentence.addHook(updateSentenceHook);
	drag.spacer.addHook(updateSentenceHook);

	return $(
		"section",
		drag.tile,
		wordbanks.nonfixed,
		// $("p", "(Tip: You can type on your keyboard to quickly search for words.)"),
		// TODO: ^^^ Implement this ^^^
		sentence.body,
		sentence.length,
		wordbanks.fixed,
	);
});
