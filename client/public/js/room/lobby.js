/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $button, $replace } from "../framework.js";
import { RoomStates, RoomData, RoomClients } from "./state.js";
import { sendStartGame, sendCancelStartGame } from "../packets/send.js";
import { ClientInfo } from "../app/state.js";
import { Table } from "./table.js";

export const Lobby = createSingletonView(() => {
	const players = $("p");

	const hook = () => {
		const limit = RoomData.clientLimit.get();
		const ownerID = RoomData.ownerID.get();
		const clients = RoomClients.get();
		const { clientID } = ClientInfo.get();
		const rows = [];

		for (let i = 0; i < limit; i++) {
			if (i >= clients.length) {
				rows.push(["\u00A0", "\u00A0"]);
			} else {
				const { id, name } = clients[i];

				if (id === ownerID) {
					rows.push([{ className: "room-owner" }, [id === clientID ? "Owner (You)" : "Owner", name]]);
				} else {
					rows.push([id === clientID ? "You" : "\u00A0", name]);
				}
			}
		}

		$replace(
			players,
			Table(
				[
					["Role", "15%"],
					["Name", "85%"],
				],
				...rows,
			),
		);
	};

	RoomData.clientLimit.addHook(hook);
	RoomData.ownerID.addHook(hook);
	RoomClients.addHook(hook);

	const button = $button("", "primary", () => {
		if (RoomData.state.get() === RoomStates.Lobby) {
			sendStartGame();
		} else {
			sendCancelStartGame();
		}

		button.disabled = true;
	});

	RoomData.state.addHook(state => {
		button.textContent = state === RoomStates.Lobby ? "Start Game" : "Cancel";
		button.disabled = false;

		if (RoomData.ownerID.get() === ClientInfo.get().clientID) {
			button.classList.remove("hidden");
		} else {
			button.classList.add("hidden");
		}
	});

	return $("section", $("p", $("strong", "Players:"), players), $("p", button));
});
