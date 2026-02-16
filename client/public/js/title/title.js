/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState, createSingletonView, $ } from "../framework.js";
import { Fields } from "../fields.js";
import { sendCreateRoom, sendJoinRoom } from "../packets/send.js";
import { RoomFields } from "./roomFields.js";
import { onRelease } from "../util.js";

export const Title = createSingletonView(() => {
	const tabCreate = $(
		"button",
		{
			className: "tab",
			...onRelease(() => {
				TabState.set(true);
			}),
		},
		"Create",
	);

	const tabJoin = $(
		"button",
		{
			className: "tab",
			...onRelease(() => {
				TabState.set(false);
			}),
		},
		"Join",
	);

	const fieldsCreate = RoomFields({
		fields: structuredClone(Fields.createRoom),
		title: "Create a Room",
		buttonText: "Create Room",
		onButtonClick: sendCreateRoom,
	});

	const fieldsJoin = RoomFields({
		fields: structuredClone(Fields.joinRoom),
		title: "Join a Room",
		buttonText: "Join Room",
		onButtonClick: sendJoinRoom,
	});

	const TabState = createState(true, value => {
		tabCreate.disabled = value;
		tabJoin.disabled = !value;
		fieldsCreate.hidden = !value;
		fieldsJoin.hidden = value;
	});

	return $("article", $("h1", "Word Magnets"), tabCreate, tabJoin, fieldsCreate, fieldsJoin);
});
