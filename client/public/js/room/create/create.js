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

	// We do want *some* leeway with dragging tiles. We don't want the player to start dragging a tile if they're just
	// trying to click on it.
	const MIN_DRAG_DIST = 10;

	const DRAG_TILE_Z_INDEX = 10;

	const SHAKE_TIME = 300;

	const FADE_FAST = 0.25;
	const FADE_SLOW = 0.5;

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
				$getAll("button.word-tile").forEach(
					tile => (tile.style.animation = `brief-shake ${SHAKE_TIME / 1000}s linear 1`),
				);

				Sentence.shakeTimeout = setTimeout(() => {
					Sentence.shakeTimeout = 0;
					$getAll("button.word-tile").forEach(tile => (tile.style.animation = ""));
				}, SHAKE_TIME);
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
		dragging: createState(false),
		// The data of the word we're dragging.
		word: createState({ bankIndex: -1, wordIndex: -1, sentenceIndex: -1 }),
		/* The coordinates of when we first pressed on the tile. We keep track of this so dragging tiles isn't too sensitive. */
		firstPress: { x: 0.0, y: 0.0 },

		// This is the element that actually gets moved when dragging a word tile. It just copies its contents from the
		// selected tile.
		tile: Button("", "word-tile hidden", {
			style: { position: "absolute", "z-index": DRAG_TILE_Z_INDEX, left: "0px", top: "0px" },
		}),

		// Move the tile we're dragging.
		move(x, y) {
			const { tile } = Drag;
			const { tiles } = Sentence;

			tile.style.left = `${x - Drag.firstPress.x}px`;
			tile.style.top = `${y - Drag.firstPress.y}px`;

			const tileBounds = tile.getBoundingClientRect();
			const center = $center(tile);

			if (!testBoxOverlap(tileBounds, Sentence.body.getBoundingClientRect())) {
				// Our tile is not within the bounds of the sentence box, so we're not adding a word to the sentence.
				Drag.word.set({ ...Drag.word.get(), sentenceIndex: -1 });
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

				Drag.word.set({ ...Drag.word.get(), sentenceIndex });
			}
		},
	};

	Drag.dragging.addHook(dragging => {
		if (dragging) {
			/* Start dragging the tile. */

			const { bankIndex, wordIndex, sentenceIndex } = Drag.word.get();
			const word = getRoomWord(bankIndex, wordIndex);

			Drag.tile.textContent = word.trim() === "" ? "\u00A0" : word;
			Drag.tile.style.transition = "";
			Drag.tile.classList.remove("hidden");

			if (sentenceIndex >= 0) {
				removeWord(sentenceIndex);
			}
		} else {
			/* Stop dragging the tile. */

			const { bankIndex, wordIndex, sentenceIndex } = Drag.word.get();
			let fade = 0.0;

			if (sentenceIndex < 0) {
				fade = FADE_FAST;
			} else {
				if (!addWord({ bankIndex, wordIndex }, sentenceIndex)) {
					fade = FADE_SLOW;
					Sentence.shakeTiles();
				}
			}

			if (fade > 0.0) {
				Drag.tile.style.transition = `visibility ${fade}s, opacity ${fade}s`;
			}

			Drag.word.reset();
			Drag.firstPress = { x: 0.0, y: 0.0 };
			Drag.tile.classList.add("hidden");
		}
	});

	// Start drag logic
	document.addEventListener("pointermove", ({ buttons, offsetX, offsetY, pageX, pageY }) => {
		const { bankIndex, wordIndex } = Drag.word.get();

		if (bankIndex >= 0 && wordIndex >= 0 && buttons & MOUSE_LEFT) {
			const distance = Math.sqrt((offsetX - Drag.firstPress.x) ** 2 + (offsetY - Drag.firstPress.y) ** 2);
			const dragging = Drag.dragging.get();

			if (dragging || (!dragging && distance >= MIN_DRAG_DIST)) {
				if (!dragging) {
					Drag.dragging.set(true);
				}

				Drag.move(pageX, pageY, true);
			}
		}
	});

	document.addEventListener("pointerup", () => {
		if (Drag.dragging.get()) {
			Drag.dragging.set(false);
		}
	});

	const cancelInput = () => {
		Drag.dragging.set(false);

		Sentence.ctrlKey = false;
		Sentence.shiftKey = false;
	};

	document.addEventListener("pointerleave", cancelInput);
	document.addEventListener("pointercancel", cancelInput);

	// Prevent scrolling while dragging a tile on mobile devices.
	document.addEventListener(
		"touchmove",
		event => {
			if (Drag.dragging.get()) {
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

					// If a control key is being held, the word gets added to the beginning of the sentence instead of
					// the end.
					const sentenceIndex = Sentence.ctrlKey ? 0 : Infinity;

					if (!addWord({ bankIndex, wordIndex }, sentenceIndex)) {
						// We could not be added to the sentence, so play the shake animation.
						Sentence.shakeTiles();
					}
				}

				Drag.dragging.set(false);
			},

			onpointerdown({ offsetX, offsetY }) {
				Drag.word.set({ bankIndex, wordIndex, sentenceIndex });
				Drag.firstPress = { x: offsetX, y: offsetY };
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
		Drag.dragging.set(false);
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
			const { bankIndex, wordIndex, sentenceIndex } = Drag.word.get();

			// Insert spacer element if needed.
			if (sentenceIndex >= 0 && Drag.dragging.get()) {
				tiles.splice(sentenceIndex, 0, Spacer(bankIndex, wordIndex));
			}

			$replace(Sentence.body, clearButton, ...tiles, preview);
		}
	};

	UserSentence.addHook((newSentence, _, oldSentence) => {
		if (newSentence.words.length < oldSentence.words.length) {
			Drag.word.set({ ...Drag.word.get(), sentenceIndex: -1 });
		}

		updateSentenceHook();
	});

	Drag.word.addHook(({ sentenceIndex: newIndex }, _, { sentenceIndex: oldIndex }) => {
		if (newIndex !== oldIndex && (Drag.dragging.get() || newIndex === -1)) {
			updateSentenceHook();
		}
	});

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
