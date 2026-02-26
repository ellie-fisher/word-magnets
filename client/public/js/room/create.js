/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $button, $replace, $getAll, getElementCenter, createState } from "../framework.js";

import { RoomStates, RoomData, RoomWords, UserSentence, setSentence } from "./state.js";
import { flagFixed, hasIndex } from "../util.js";
import { MAX_LENGTH } from "./sentences.js";

export const Create = createSingletonView(() => {
	const MOUSE_LEFT = 1 << 0;

	const Sentence = {
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
			if (Sentence.shakeTimeout === 0) {
				$getAll("button.word-tile").forEach(tile => (tile.style.animation = "brief-shake 0.3s linear 1"));

				Sentence.shakeTimeout = setTimeout(() => {
					Sentence.shakeTimeout = 0;
					$getAll("button.word-tile").forEach(tile => (tile.style.animation = ""));
				}, 300);
			}
		},
	};

	const Wordbanks = { nonfixed: $("section"), fixed: $("section") };

	// Everything related to dragging tiles.
	const Drag = {
		tiles: [],
		dragging: false,
		selected: { bankIndex: -1, wordIndex: -1, sentenceIndex: -1, tile: null, pressX: 0, pressY: 0 },

		// The gap that appears between tiles when dragging a tile in(to) a sentence.
		spacer: createState({ bankIndex: -1, wordIndex: -1, sentenceIndex: -1 }),

		// Tile that appears when dragging another word tile.
		tile: $button("", "word-tile hidden", {
			style: { position: "absolute", "z-index": 10, left: "0px", top: "0px" },
		}),

		start() {
			Drag.tile.textContent = Drag.selected.tile.textContent;
			Drag.tile.style.transition = "";
			Drag.tile.classList.remove("hidden");
			Drag.dragging = true;

			if (Drag.selected.sentenceIndex >= 0) {
				Sentence.removeWord(Drag.selected.sentenceIndex);
			}
		},

		stop() {
			const { sentenceIndex } = Drag.spacer.get();
			let fade = 0;

			if (sentenceIndex < 0) {
				fade = 0.25;
			} else {
				const { bankIndex, wordIndex } = Drag.selected;

				if (!Sentence.addWord({ bankIndex, wordIndex }, sentenceIndex)) {
					fade = 0.5;
					Sentence.shakeTiles();
				}
			}

			if (fade > 0) {
				Drag.tile.style.transition = `visibility ${fade}s, opacity ${fade}s`;
			}

			Drag.spacer.reset();
			Drag.selected = { bankIndex: -1, wordIndex: -1, sentenceIndex: -1, tile: null, pressX: 0, pressY: 0 };
			Drag.dragging = false;
			Drag.tile.classList.add("hidden");
		},

		move(x, y) {
			const { tile, tiles, selected } = Drag;

			tile.style.left = `${x - selected.pressX}px`;
			tile.style.top = `${y - selected.pressY}px`;

			const { top, bottom, left, right } = tile.getBoundingClientRect();
			const center = getElementCenter(tile);
			const bodyBounds = Sentence.body.getBoundingClientRect();

			if (
				bottom < bodyBounds.top ||
				top > bodyBounds.bottom ||
				right < bodyBounds.left ||
				left > bodyBounds.right
			) {
				Drag.spacer.reset();
			} else {
				let insertTile = tiles.length <= 0;
				let sentenceIndex = Infinity;

				for (let i = 0; i < tiles.length && !insertTile; i++) {
					const testTile = tiles[i];
					const testBounds = testTile.getBoundingClientRect();
					const testCenter = getElementCenter(testTile);

					if (bottom >= testBounds.top && top <= testBounds.bottom) {
						if (testCenter.x >= center.x) {
							sentenceIndex = i;
							insertTile = true;
						} else if (testCenter.x < center.x && i === tiles.length - 1) {
							sentenceIndex = Infinity;
							insertTile = true;
						} else if (i < tiles.length - 1) {
							const nextBounds = tiles.at(i + 1).getBoundingClientRect();

							if (center.y < nextBounds.top && testBounds.top < nextBounds.top) {
								sentenceIndex = i + 1;
								insertTile = true;
							}
						}
					}
				}

				if (insertTile) {
					Drag.spacer.set({ bankIndex: selected.bankIndex, wordIndex: selected.wordIndex, sentenceIndex });
				}
			}
		},
	};

	document.addEventListener("pointermove", ({ buttons, offsetX, offsetY, pageX, pageY }) => {
		const { tile, pressX, pressY } = Drag.selected;

		if (tile !== null && buttons & MOUSE_LEFT) {
			const distance = Math.sqrt((offsetX - pressX) ** 2 + (offsetY - pressY) ** 2);

			if (Drag.dragging || (!Drag.dragging && distance >= 10)) {
				if (!Drag.dragging) {
					Drag.start();
				}

				Drag.move(pageX, pageY, true);
			}
		}
	});

	document.addEventListener("pointerup", event => {
		if (Drag.dragging) {
			Drag.stop(event.pageX, event.pageY);
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
					Sentence.removeWord(sentenceIndex);
				} else if (!Sentence.addWord({ bankIndex, wordIndex })) {
					Sentence.shakeTiles();
				}
			},
			{
				onpointerdown({ offsetX, offsetY, target }) {
					Drag.selected = {
						bankIndex,
						wordIndex,
						sentenceIndex,
						tile: target,
						pressX: offsetX,
						pressY: offsetY,
					};
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
		const { fixed, nonfixed } = Wordbanks;

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
		const preview = $("p", { className: "sentence-preview" }, string === "" ? "\u00A0" : string);

		$replace(Sentence.length, $("span", $("strong", "Length: "), `${length} / ${MAX_LENGTH}`));

		if (words.length <= 0) {
			$replace(Sentence.body, Sentence.spacer, preview);
		} else {
			Drag.tiles = words.map(({ bankIndex, wordIndex }, sentenceIndex) => {
				return Tile(bankIndex, wordIndex, sentenceIndex);
			});

			const tiles = [...Drag.tiles];
			const dragSpacer = Drag.spacer.get();

			if (dragSpacer.sentenceIndex >= 0) {
				tiles.splice(dragSpacer.sentenceIndex, 0, Spacer(dragSpacer.bankIndex, dragSpacer.wordIndex));
			}

			$replace(Sentence.body, ...tiles, preview);
		}
	};

	UserSentence.addHook(updateSentenceHook);
	Drag.spacer.addHook(updateSentenceHook);

	return $(
		"section",
		Drag.tile,
		Wordbanks.nonfixed,
		// $("p", "(Tip: You can type on your keyboard to quickly search for words.)"),
		// TODO: ^^^ Implement this ^^^
		Sentence.body,
		Sentence.length,
		Wordbanks.fixed,
	);
});
