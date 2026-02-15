/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $, $replace, createEffect } from "../framework.js";
import { RoomStates, sendStartGame, sendCancelStartGame } from "../packets.js";
import { onRelease } from "../util.js";
import { getClients, RoomData } from "./state.js";

export const Lobby = (data = {}) => {
	const { socket = null, state = 0 } = data;
	const players = $("p", { className: "player-list" });

	createEffect(() => {
		const limit = RoomData.get.clientLimit();
		const clients = getClients();
		const children = [];

		for (let i = 0; i < limit; i++) {
			if (i < clients.length) {
				const { id, name } = clients[i];
				children.push($("span", { title: id }, name));
			} else {
				children.push($("span", "\u00A0"));
			}
		}

		$replace(players, ...children);
	});

	return $(
		"section",
		$("p", $("strong", "Players:"), players),
		$(
			"p",
			$(
				"button",
				{
					className: "primary",
					...onRelease(() => {
						if (socket !== null) {
							if (state === RoomStates.Lobby) {
								sendStartGame(socket);
							} else {
								sendCancelStartGame(socket);
							}
						}
					}),
				},
				state === RoomStates.Lobby ? "Start Game" : "Cancel",
			),
		),
	);
};
