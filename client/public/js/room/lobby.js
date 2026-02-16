/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace } from "../framework.js";
import { RoomStates, RoomData, RoomClients } from "./state.js";
import { sendStartGame, sendCancelStartGame } from "../packets/send.js";

export const Lobby = createSingletonView(() => {
	const players = $("p", { className: "player-list" });

	const hook = () => {
		const limit = RoomData.clientLimit.get();
		const ownerID = RoomData.ownerID.get();
		const clients = RoomClients.get();
		const children = [];

		for (let i = 0; i < limit; i++) {
			if (i < clients.length) {
				const { id, name } = clients[i];

				if (id === ownerID) {
					children.push($("span", { className: "player-list-owner", title: id }, `* ${name}`));
				} else {
					children.push($("span", { title: id }, `  ${name}`));
				}
			} else {
				children.push($("span", "\u00A0"));
			}
		}

		$replace(players, ...children);
	};

	RoomData.clientLimit.addHook(hook);
	RoomData.ownerID.addHook(hook);
	RoomClients.addHook(hook);

	const button = $("button", {
		className: "primary",
		onclick() {
			if (RoomData.state.get() === RoomStates.Lobby) {
				sendStartGame();
			} else {
				sendCancelStartGame();
			}

			button.disabled = true;
		},
	});

	RoomData.state.addHook(state => {
		button.textContent = state === RoomStates.Lobby ? "Start Game" : "Cancel";
		button.disabled = false;
	});

	return $("section", $("p", $("strong", "Players:"), players), $("p", button));
});
