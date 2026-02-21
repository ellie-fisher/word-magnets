/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace, $button } from "../framework.js";
import { sendSubmitVote } from "../packets/send.js";
import { RoomData, RoomSentences, RoomStates } from "./state.js";
import { Table } from "./table.js";

export const Vote = createSingletonView(() => {
	const container = $("p");
	const submit = $button("Submit Vote", "primary", () => {
		if (!RoomSentences.voteSubmitted.get()) {
			sendSubmitVote(RoomSentences.vote.get());
			RoomSentences.voteSubmitted.set(true);
		}
	});

	RoomSentences.voteSubmitted.addHook(submitted => (submit.disabled = submitted));

	const hook = () => {
		const rows = [];
		const vote = RoomSentences.vote.get();
		const disabled = RoomData.state.get() === RoomStates.VoteSubmit;
		const sentences = RoomSentences.sentences.get();

		if (sentences.length <= 0 || (sentences.length === 1 && sentences[0].value === "")) {
			submit.style.visibility = "hidden";
			$replace(container, $("p", $("em", "No sentences to show!")));
		} else {
			submit.style.visibility = "visible";
			sentences.forEach(({ value = "" }, index) => {
				if (value !== "") {
					const selected = vote === index;
					const clickable = !selected && !disabled;

					rows.push([
						{
							className: `${clickable ? "clickable" : ""} ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`,
							onclick() {
								if (clickable && index >= 0) {
									RoomSentences.vote.set(index);
								}
							},
						},
						[value],
					]);
				}
			});

			$replace(container, Table([["Click on a sentence below:", "100%"]], ...rows));
		}
	};

	RoomData.state.addHook(hook);
	RoomSentences.sentences.addHook(hook);
	RoomSentences.vote.addHook(hook);

	return $("section", container, submit);
});
