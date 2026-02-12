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
import { getRoomData } from "./state.js";
import { Header } from "./header.js";
import { Lobby } from "./lobby.js";
import { Create } from "./create.js";

export const Room = (data = {}) => {
	const { socket = null } = data;
	const body = $("section");
	let prevState = null;

	createEffect(() => {
		let view = "Unknown room view! (Ask a nerd what this means.)";

		const { state } = getRoomData();

		if (state === prevState) {
			return;
		}

		prevState = state;

		switch (state) {
			case RoomStates.Lobby:
			case RoomStates.StartGame: {
				view = Lobby({ socket, state });
				break;
			}

			case RoomStates.Create: {
				view = Create();
				break;
			}

			default:
				break;
		}

		$replace(body, view);
	});

	return $("article", $("h1", "Lobby"), Header(), body);
};
