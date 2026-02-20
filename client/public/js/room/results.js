/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace } from "../framework.js";
import { RoomSentences } from "./state.js";
import { Table } from "./table.js";

export const Results = createSingletonView(() => {
	const container = $("p");

	RoomSentences.sentences.addHook(() => {
		const rows = [];
		const vote = RoomSentences.vote.get();
		const sentences = structuredClone(RoomSentences.sentences.get());
		let highest = 0;

		sentences.sort((sentence1, sentence2) => {
			if (sentence1.votes > highest) {
				highest = sentence1.votes;
			}

			if (sentence2.votes > highest) {
				highest = sentence2.votes;
			}

			return sentence2.votes - sentence1.votes;
		});

		if (sentences.length <= 0) {
			$replace(container, $("p", $("em", "No valid sentences were submitted!")));
		} else {
			sentences.forEach(({ author = "\u00A0", value = "\u00A0", votes = 0, index = -1 }) => {
				if (value !== "") {
					let className = "";

					if (vote === index) {
						className += " selected";
					}

					if (votes >= highest) {
						className += " room-owner";
					}

					rows.push(
						className === "" ? [author, value, `${votes}`] : [{ className }, [author, value, `${votes}`]],
					);
				}
			});

			$replace(
				container,
				Table(
					[
						["Author", "15%"],
						["Sentence", "82%"],
						["Votes", "3%"],
					],
					...rows,
				),
			);
		}
	});

	return $("section", container);
});
