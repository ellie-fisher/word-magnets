/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState, $singleton, $replace } from "../framework.js";
import { Fields } from "../fields.js";
import { sendCreateRoom, sendJoinRoom, sendRequestServerInfo } from "../packets/send.js";
import { RoomFields } from "./roomFields.js";
import { ServerInfo } from "../app/state.js";
import { Article, Button, H1, P, Section, Span } from "../util/components.js";

const fieldsCreate = Span();
const fieldsJoin = Span();

export const Title = $singleton({
	onMount() {
		sendRequestServerInfo();

		$replace(
			fieldsCreate,
			RoomFields({
				fields: structuredClone(Fields.createRoom),
				title: "Create a Room",
				buttonText: "Create Room",
				onButtonClick: sendCreateRoom,
			}),
		);

		// TODO: Make room code private.
		$replace(
			fieldsJoin,
			RoomFields({
				fields: structuredClone(Fields.joinRoom),
				title: "Join a Room",
				buttonText: "Join Room",
				onButtonClick: sendJoinRoom,
			}),
		);
	},

	$element() {
		const tabCreate = Button("Create", "tab", () => TabState.set(true));
		const tabJoin = Button("Join", "tab", () => TabState.set(false));

		const TabState = createState(true, value => {
			tabCreate.disabled = value;
			tabJoin.disabled = !value;
			fieldsCreate.hidden = !value;
			fieldsJoin.hidden = value;
		});

		const stats = P();

		ServerInfo.addHook(({ clientCount = 0, roomCount = 0 }) => {
			let message = "There ";

			if (clientCount === 1) {
				message += `is 1 player`;
			} else {
				message += `are ${clientCount} players`;
			}

			stats.textContent = `${message} and ${roomCount} room${roomCount != 1 ? "s" : ""}.`;
		});

		return Article(H1("Word Magnets"), tabCreate, tabJoin, fieldsCreate, fieldsJoin, Section(stats));
	},
});
