/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace } from "../framework.js";
import { RoomStates, RoomData, UserSentence, RoomSentences, clearRoomSentences } from "./state.js";
import { sendSubmitSentence, sendSubmitVote } from "../packets/send.js";
import { Header } from "./header.js";
import { Lobby } from "./lobby.js";
import { Create } from "./create.js";
import { Vote } from "./vote.js";
import { Results } from "./results.js";
import { End } from "./end.js";

export const Room = createSingletonView(() => {
	const body = $("section");
	const title = $("h2", "Lobby");

	RoomData.state.addHook(state => {
		let view = "Unknown room view! (Ask a nerd what this means.)";
		let titleText = "";

		switch (state) {
			case RoomStates.Lobby: {
				view = Lobby();
				titleText = "Lobby";
				break;
			}

			case RoomStates.StartGame: {
				view = Lobby();
				titleText = "Starting Game...";
				break;
			}

			case RoomStates.Create: {
				view = Create();
				titleText = "Create a sentence!";

				UserSentence.reset();
				clearRoomSentences();

				break;
			}

			case RoomStates.CreateSubmit: {
				view = Create();
				titleText = "Please wait...";

				if (UserSentence.get().length > 0) {
					sendSubmitSentence(UserSentence.get());
				}

				break;
			}

			case RoomStates.Vote: {
				view = Vote();
				titleText = "Choose your favorite sentence!";
				break;
			}

			case RoomStates.VoteSubmit: {
				view = Vote();
				titleText = "Please wait...";

				if (RoomSentences.vote.get() >= 0) {
					sendSubmitVote(RoomSentences.vote.get());
				}

				break;
			}

			case RoomStates.Results: {
				view = Results();
				titleText = "Results";
				break;
			}

			case RoomStates.End: {
				view = End();
				titleText = "Game is over!";
				break;
			}

			default:
				break;
		}

		$replace(body, view);
		title.textContent = titleText;
	});

	return $("article", title, Header(), body);
});
