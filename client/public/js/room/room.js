/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $, $replace, createEffect } from "../framework.js";
import { RoomStates } from "../packets.js";
import { RoomData } from "./state.js";
import { Header } from "./header.js";
import { Lobby } from "./lobby.js";
import { Create } from "./create.js";

export const Room = (data = {}) => {
	const { socket = null } = data;
	const body = $("section");
	const title = $("h2", "Lobby");
	let prevState = null;

	createEffect(() => {
		let view = "Unknown room view! (Ask a nerd what this means.)";
		let titleText = "";

		const state = RoomData.get.state();

		if (state === prevState) {
			return;
		}

		prevState = state;

		switch (state) {
			case RoomStates.Lobby: {
				view = Lobby({ socket, state });
				titleText = "Lobby";
				break;
			}

			case RoomStates.StartGame: {
				view = Lobby({ socket, state });
				titleText = "Starting Game...";
				break;
			}

			case RoomStates.Create: {
				view = Create();
				titleText = "Create a sentence!";
				break;
			}

			default:
				break;
		}

		$replace(body, view);
		title.textContent = titleText;
	});

	return $("article", title, Header({ socket }), body);
};
