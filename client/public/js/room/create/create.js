/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace, $getAll, $center, createState } from "../../framework.js";
import { RoomStates, RoomData, RoomWords, getRoomWord } from "../state.js";
import { UserSentence, addWord, moveWord, removeWord } from "./state.js";
import { Button, P, Section, Span, Strong } from "../../util/components.js";
import { flagFixed, testBoxOverlap } from "../../util/util.js";
import { MAX_LENGTH } from "./sentenceToString.js";

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
		// The sentence tile elements.
		tiles: [],
		// The sentence length element.
		length: P(),

		// The timeout ID of the tile shake animation that plays when failing to add a word to a sentence.
		shakeTimeout: 0,

		/* Modifier keys for special functions. */
		ctrlKey: false,
		shiftKey: false,

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
		// Are we currently dragging a tile?
		dragging: false,

		// This is the element that actually gets moved when dragging a word tile. It just copies its contents from the
		// selected tile.
		tile: Button("", "word-tile hidden", {
			style: { position: "absolute", "z-index": 10, left: "0px", top: "0px" },
		}),

		// The gap that appears between tiles when dragging a tile in(to) a sentence.
		spacer: createState({ bankIndex: -1, wordIndex: -1, sentenceIndex: -1 }),
		// The position in the sentence we're dragging the tile to.
		sentenceIndex: createState(-1),

		// Since we're not actually dragging the wordbank/sentence tile itself, we have to maintain a reference to its data.
		reference: { bankIndex: -1, wordIndex: -1, sentenceIndex: -1, tile: null, pressX: 0.0, pressY: 0.0 },

		// Start dragging a tile.
		start() {
			Drag.tile.textContent = Drag.reference.tile.textContent;
			Drag.tile.style.transition = "";
			Drag.tile.classList.remove("hidden");

			if (Drag.reference.sentenceIndex >= 0) {
				removeWord(Drag.reference.sentenceIndex);
			}

			Drag.dragging = true;
		},

		// Stop dragging the tile.
		stop() {
			const sentenceIndex = Drag.sentenceIndex.get();
			let fade = 0.0;

			if (sentenceIndex < 0) {
				// If we aren't inserting a tile, fade it quicker.
				fade = 0.25;
			} else {
				const { bankIndex, wordIndex } = Drag.reference;

				if (!addWord({ bankIndex, wordIndex }, sentenceIndex)) {
					/* We weren't able to add a tile, so fade it slower and shake the tiles. */
					fade = 0.5;
					Sentence.shakeTiles();
				}
			}

			if (fade > 0.0) {
				Drag.tile.style.transition = `visibility ${fade}s, opacity ${fade}s`;
			}

			Drag.reference = { bankIndex: -1, wordIndex: -1, sentenceIndex: -1, tile: null, pressX: 0.0, pressY: 0.0 };
			Drag.tile.classList.add("hidden");
			Drag.sentenceIndex.reset();
			Drag.dragging = false;
		},

		// Move the tile we're dragging.
		move(x, y) {
			const { tile, reference } = Drag;
			const { tiles } = Sentence;

			tile.style.left = `${x - reference.pressX}px`;
			tile.style.top = `${y - reference.pressY}px`;

			const tileBounds = tile.getBoundingClientRect();
			const center = $center(tile);

			if (!testBoxOverlap(tileBounds, Sentence.body.getBoundingClientRect())) {
				// Our tile is not within the bounds of the sentence box, so we're not adding a word to the sentence.
				Drag.spacer.reset();
			} else {
				let sentenceIndex = Infinity;

				// Test where we're dragging our tile in relation to the other tiles in the sentence, and then add the
				// spacer accordingly.
				for (let i = 0; i < tiles.length && sentenceIndex === Infinity; i++) {
					const testTile = tiles[i];
					const testBounds = testTile.getBoundingClientRect();
					const testCenter = $center(testTile);

					if (tileBounds.bottom >= testBounds.top && tileBounds.top <= testBounds.bottom) {
						if (testCenter.x >= center.x) {
							/* The next tile is to the right of us, so we're dropping our tile to the left of it. */
							sentenceIndex = i;
						} else if (testCenter.x < center.x && i === tiles.length - 1) {
							/* We're dropping our tile at the end of the sentence. */
							sentenceIndex = Infinity;
						} else if (i < tiles.length - 1) {
							const nextBounds = tiles.at(i + 1).getBoundingClientRect();

							// If the next tile in the sentence is on a new line, we're probably trying to insert our
							// tile before it.
							if (center.y < nextBounds.top && testBounds.top < nextBounds.top) {
								sentenceIndex = i + 1;
							}
						}
					}
				}

				Drag.sentenceIndex.set(sentenceIndex);
			}
		},
	};

	Drag.sentenceIndex.addHook(sentenceIndex => {
		if (sentenceIndex < 0) {
			Drag.spacer.reset();
		} else {
			Drag.spacer.set({
				bankIndex: Drag.reference.bankIndex,
				wordIndex: Drag.reference.wordIndex,
				sentenceIndex,
			});
		}
	});

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

	// Prevent scrolling while dragging a tile on mobile devices.
	document.addEventListener(
		"touchmove",
		event => {
			if (Drag.dragging) {
				event.preventDefault();
			}
		},
		{ passive: false },
	);

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
		const word = getRoomWord(bankIndex, wordIndex);

		return Button(word.trim() === "" ? "\u00A0" : word, "word-tile", {
			onclick() {
				if (sentenceIndex >= 0) {
					/* We are a sentence tile. */

					if (Sentence.ctrlKey) {
						// If a control key is being held, the word gets sent to the beginning of the sentence.
						moveWord(sentenceIndex, 0);
					} else if (Sentence.shiftKey) {
						// If a shift key is being held, the word gets sent to the end of the sentence.
						moveWord(sentenceIndex, Infinity);
					} else {
						// Otherwise, we're trying to remove the word from the sentence.
						removeWord(sentenceIndex);
					}
				} else {
					/* We are a wordbank tile, so we're trying to be added to the sentence. */

					// If a control key is being held, the word gets added to the beginning of the
					// sentence instead of the end.
					const sentenceIndex = Sentence.ctrlKey ? 0 : Infinity;

					if (!addWord({ bankIndex, wordIndex }, sentenceIndex)) {
						// We could not be added to the sentence, so play the shake animation.
						Sentence.shakeTiles();
					}
				}

				Drag.stop();
			},

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
		});
	};

	// The gap that appears between tiles when dragging a tile in(to) a sentence.
	const Spacer = (bankIndex, wordIndex) => {
		const word = getRoomWord(bankIndex, wordIndex);

		return Button(word.trim() === "" ? "\u00A0" : word, "word-tile hidden");
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
		Drag.stop();
		$getAll("button.word-tile").forEach(tile => (tile.disabled = state === RoomStates.CreateSubmit));
	});

	const updateSentenceHook = () => {
		const { words = [], string = "\u00A0", length = 0 } = UserSentence.get();
		// The plaintext sentence preview. We use a special whitespace character when it's empty to maintain its height.
		const preview = P({ className: "sentence-preview" }, string === "" ? "\u00A0" : string);
		// The red X button that clears the entire sentence.
		const clearButton = Button("\u2716", { className: "clear-sentence", onclick: () => UserSentence.reset() });

		// Display current sentence length out of max.
		$replace(Sentence.length, Span(Strong("Length: "), `${length} / ${MAX_LENGTH}`));

		if (words.length <= 0) {
			Sentence.tiles = [];
			$replace(Sentence.body, Button("\u00A0", "word-tile hidden"), clearButton, preview);
		} else {
			Sentence.tiles = words.map(({ bankIndex, wordIndex }, sentenceIndex) => {
				return Tile(bankIndex, wordIndex, sentenceIndex);
			});

			const tiles = [...Sentence.tiles];
			const dragSpacer = Drag.spacer.get();

			// Insert spacer element if needed.
			if (dragSpacer.sentenceIndex >= 0) {
				tiles.splice(dragSpacer.sentenceIndex, 0, Spacer(dragSpacer.bankIndex, dragSpacer.wordIndex));
			}

			$replace(Sentence.body, clearButton, ...tiles, preview);
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
