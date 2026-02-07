/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createEffect, createSignal, $ } from "../framework.js";
import { Fields } from "../fields.js";
import { sendCreateRoom, sendJoinRoom } from "../packets.js";
import { RoomFields } from "./roomFields.js";

export const Title = (data = {}) => {
	const [tab, setTab] = createSignal(true);

	const children = [
		$(
			"button",
			{
				className: "tab",
				onclick() {
					setTab(true);
				},
			},
			"Create",
		),

		$(
			"button",
			{
				className: "tab",
				onclick() {
					setTab(false);
				},
			},
			"Join",
		),

		RoomFields({
			fields: structuredClone(Fields.createRoom),
			socket: data.socket ?? null,
			title: "Create a Room",
			buttonText: "Create Room",
			onButtonClick: sendCreateRoom,
		}),

		RoomFields({
			fields: structuredClone(Fields.joinRoom),
			socket: data.socket ?? null,
			title: "Join a Room",
			buttonText: "Join Room",
			onButtonClick: sendJoinRoom,
		}),
	];

	createEffect(() => {
		children[0].disabled = tab();
		children[1].disabled = !tab();
		children[2].hidden = !tab();
		children[3].hidden = tab();
	});

	return $("article", $("h1", "Word Magnets"), ...children);
};
