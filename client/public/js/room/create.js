/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace, $getAll, $center, createState } from "../framework.js";
import { RoomStates, RoomData, RoomWords, UserSentence, setSentence } from "./state.js";
import { Button, P, Section, Span, Strong } from "../util/components.js";
import { flagFixed, hasIndex } from "../util/util.js";
import { MAX_LENGTH } from "./sentences.js";

/**
 * The "Create" phase of the game. This is the core gameplay mechanic where players create sentences using tiles.
 */
export const Create = createSingletonView(() => {
	// Left mouse button flag for pointer events.
	const MOUSE_LEFT = 1 << 0;

	/**
	 * Everything related to the player's sentence.
	 */
	const Sentence = {
		// The main body of the sentence. It contains the tiles and the sentence preview.
		body: Section({ className: "sentence" }),

		// The sentence length element.
		length: P(),

		// The spacer is how we insert gaps in between sentence tiles when dragging a tile into it. It's actually a
		// hidden tile that gets its contents set to whatever word we're currently dragging.
		spacer: Button("\u00A0", "word-tile hidden"),

		// The timeout ID of the tile shake animation that plays when failing to add a word to a sentence.
		shakeTimeout: 0,

		/* Modifier keys for special functions. */
		ctrlKey: false,
		shiftKey: false,

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

		// Move a word in a sentence.
		moveWord(fromIndex, toIndex) {
			const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };

			fromIndex = fromIndex === Infinity ? sentence.words.length - 1 : fromIndex;

			if (!hasIndex(sentence.words, fromIndex) || (!hasIndex(sentence.words, toIndex) && toIndex !== Infinity)) {
				return false;
			}

			if (fromIndex !== toIndex) {
				if (toIndex === Infinity) {
					sentence.words.push(sentence.words[fromIndex]);
				} else {
					sentence.words.splice(toIndex, 0, sentence.words[fromIndex]);
				}

				if (fromIndex > toIndex) {
					fromIndex++;
				}

				sentence.words.splice(fromIndex, 1);
			}

			return setSentence(sentence);
		},

		// Removes a word from the sentence.
		removeWord(index) {
			const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };
			sentence.words.splice(index, 1);
			return setSentence(sentence);
		},

		// Shake tiles when you cannot add a new word to the sentence. This is kinda hacky but oh well!
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

	/**
	 * Everything related to wordbanks.
	 */
	const Wordbanks = {
		// Words that change per round (nouns, adjectives, verbs, player names).
		nonfixed: Section(),

		// Words that don't change per round (pronouns, auxiliaries, prepositions, miscellaneous utility tiles).
		fixed: Section(),
	};

	/**
	 * Everything related to dragging tiles.
	 */
	const Drag = {
		// The actual sentence tile elements.
		tiles: [],

		// Are we currently dragging a tile?
		dragging: false,

		// This is the element that actually gets moved when dragging a word tile. It just copies its contents from the
		// selected tile.
		tile: Button("", "word-tile hidden", {
			style: { position: "absolute", "z-index": 10, left: "0px", top: "0px" },
		}),

		// The gap that appears between tiles when dragging a tile in(to) a sentence.
		spacer: createState({ bankIndex: -1, wordIndex: -1, sentenceIndex: -1 }),

		// Since we're not actually dragging the wordbank/sentence tile itself, we have to maintain a reference to its data.
		reference: { bankIndex: -1, wordIndex: -1, sentenceIndex: -1, tile: null, pressX: 0, pressY: 0 },

		// Start dragging a tile.
		start() {
			Drag.tile.textContent = Drag.reference.tile.textContent;
			Drag.tile.style.transition = "";
			Drag.tile.classList.remove("hidden");
			Drag.dragging = true;

			if (Drag.reference.sentenceIndex >= 0) {
				Sentence.removeWord(Drag.reference.sentenceIndex);
			}
		},

		// Stop dragging the tile.
		stop() {
			const { sentenceIndex } = Drag.spacer.get();
			let fade = 0;

			if (sentenceIndex < 0) {
				// If we aren't inserting a tile, fade it quicker.
				fade = 0.25;
			} else {
				const { bankIndex, wordIndex } = Drag.reference;

				if (!Sentence.addWord({ bankIndex, wordIndex }, sentenceIndex)) {
					/* We weren't able to add a tile, so fade it slower and shake the tiles. */
					fade = 0.5;
					Sentence.shakeTiles();
				}
			}

			if (fade > 0) {
				Drag.tile.style.transition = `visibility ${fade}s, opacity ${fade}s`;
			}

			Drag.spacer.reset();
			Drag.reference = { bankIndex: -1, wordIndex: -1, sentenceIndex: -1, tile: null, pressX: 0, pressY: 0 };
			Drag.dragging = false;
			Drag.tile.classList.add("hidden");
		},

		// Move the tile we're dragging.
		move(x, y) {
			const { tile, tiles, reference } = Drag;

			tile.style.left = `${x - reference.pressX}px`;
			tile.style.top = `${y - reference.pressY}px`;

			const { top, bottom, left, right } = tile.getBoundingClientRect();
			const center = $center(tile);
			const bodyBounds = Sentence.body.getBoundingClientRect();

			if (
				bottom < bodyBounds.top ||
				top > bodyBounds.bottom ||
				right < bodyBounds.left ||
				left > bodyBounds.right
			) {
				// Our tile is not within the bounds of the sentence box, so we're not adding a word to the sentence.
				Drag.spacer.reset();
			} else {
				let insertSpacer = tiles.length <= 0;
				let sentenceIndex = Infinity;

				// Test where we're dragging our tile in relation to the other tiles in the sentence, and then add the
				// spacer accordingly.
				for (let i = 0; i < tiles.length && !insertSpacer; i++) {
					const testTile = tiles[i];
					const testBounds = testTile.getBoundingClientRect();
					const testCenter = $center(testTile);

					if (bottom >= testBounds.top && top <= testBounds.bottom) {
						if (testCenter.x >= center.x) {
							/* The next tile is to the right of us, so we're dropping our tile to the left of it. */
							sentenceIndex = i;
							insertSpacer = true;
						} else if (testCenter.x < center.x && i === tiles.length - 1) {
							/* We're dropping our tile at the end of the sentence. */
							sentenceIndex = Infinity;
							insertSpacer = true;
						} else if (i < tiles.length - 1) {
							const nextBounds = tiles.at(i + 1).getBoundingClientRect();

							// If the next tile in the sentence is on a new line, we're probably trying to insert our
							// tile before it.
							if (center.y < nextBounds.top && testBounds.top < nextBounds.top) {
								sentenceIndex = i + 1;
								insertSpacer = true;
							}
						}
					}
				}

				if (insertSpacer) {
					Drag.spacer.set({ bankIndex: reference.bankIndex, wordIndex: reference.wordIndex, sentenceIndex });
				}
			}
		},
	};

	document.addEventListener("pointermove", ({ buttons, offsetX, offsetY, pageX, pageY }) => {
		const { tile, pressX, pressY } = Drag.reference;

		if (tile !== null && buttons & MOUSE_LEFT) {
			// We do want *some* leeway with dragging tiles. We don't want the player to start dragging a tile if
			// they're just trying to click on it.
			const distance = Math.sqrt((offsetX - pressX) ** 2 + (offsetY - pressY) ** 2);

			if (Drag.dragging || (!Drag.dragging && distance >= 10)) {
				if (!Drag.dragging) {
					Drag.start();
				}

				Drag.move(pageX, pageY, true);
			}
		}
	});

	document.addEventListener("pointerup", () => {
		if (Drag.dragging) {
			Drag.stop();
		}
	});

	const cancelInput = () => {
		Drag.stop();
		Sentence.ctrlKey = false;
		Sentence.shiftKey = false;
	};

	document.addEventListener("pointerleave", cancelInput);
	document.addEventListener("pointercancel", cancelInput);

	document.addEventListener("keydown", event => {
		Sentence.ctrlKey = event.ctrlKey;
		Sentence.shiftKey = event.shiftKey;
	});

	document.addEventListener("keyup", event => {
		Sentence.ctrlKey = event.ctrlKey;
		Sentence.shiftKey = event.shiftKey;
	});

	// A tile in a wordbank or a sentence.
	const Tile = (bankIndex, wordIndex, sentenceIndex = -1) => {
		const bank = RoomWords.get()[bankIndex];
		const word = bank.words[wordIndex];

		return Button(
			word === " " ? "\u00A0" : word,
			"word-tile",
			() => {
				if (sentenceIndex >= 0) {
					/* We are a sentence tile. */

					if (Sentence.ctrlKey) {
						// If a control key is being held, the word gets sent to the beginning of the sentence.
						Sentence.moveWord(sentenceIndex, 0);
					} else if (Sentence.shiftKey) {
						// If a shift key is being held, the word gets sent to the end of the sentence.
						Sentence.moveWord(sentenceIndex, Infinity);
					} else {
						// Otherwise, we're trying to remove the word from the sentence.
						Sentence.removeWord(sentenceIndex);
					}
				} else {
					/* We are a wordbank tile, so we're trying to be added to the sentence. */

					// If a control key is being held, the word gets added to the beginning of the
					// sentence instead of the end.
					const sentenceIndex = Sentence.ctrlKey ? 0 : Infinity;

					if (!Sentence.addWord({ bankIndex, wordIndex }, sentenceIndex)) {
						// We could not be added to the sentence, so play the shake animation.
						Sentence.shakeTiles();
					}
				}
			},
			{
				onpointerdown({ offsetX, offsetY, target }) {
					Drag.reference = {
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

		return Button(word === " " ? "\u00A0" : word, "word-tile hidden");
	};

	RoomWords.addHook(() => {
		const { fixed, nonfixed } = Wordbanks;

		$replace(fixed);
		$replace(nonfixed);

		RoomWords.get().forEach(bank =>
			(bank.flags & flagFixed ? fixed : nonfixed).append(
				P({ className: "wordbank" }, ...bank.words.map((_, wordIndex) => Tile(bank.index, wordIndex))),
			),
		);
	});

	RoomData.state.addHook(state => {
		$getAll("button.word-tile").forEach(tile => (tile.disabled = state === RoomStates.CreateSubmit));
	});

	const updateSentenceHook = () => {
		const { words = [], string = "\u00A0", length = 0 } = UserSentence.get();
		const preview = P({ className: "sentence-preview" }, string === "" ? "\u00A0" : string);

		$replace(Sentence.length, Span(Strong("Length: "), `${length} / ${MAX_LENGTH}`));

		if (words.length <= 0) {
			$replace(Sentence.body, Sentence.spacer, preview);
		} else {
			Drag.tiles = words.map(({ bankIndex, wordIndex }, sentenceIndex) => {
				return Tile(bankIndex, wordIndex, sentenceIndex);
			});

			const tiles = [...Drag.tiles];
			const dragSpacer = Drag.spacer.get();

			// Insert spacer element if needed.
			if (dragSpacer.sentenceIndex >= 0) {
				tiles.splice(dragSpacer.sentenceIndex, 0, Spacer(dragSpacer.bankIndex, dragSpacer.wordIndex));
			}

			$replace(Sentence.body, ...tiles, preview);
		}
	};

	UserSentence.addHook(updateSentenceHook);
	Drag.spacer.addHook(updateSentenceHook);

	return Section(
		Drag.tile,
		Wordbanks.nonfixed,
		// P("(Tip: You can type on your keyboard to quickly search for words.)"),
		// TODO: ^^^ Implement this ^^^
		Sentence.body,
		Sentence.length,
		Wordbanks.fixed,
	);
});
