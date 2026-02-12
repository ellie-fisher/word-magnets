/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $ } from "../framework.js";
import { RoomStates, sendStartGame, sendCancelStartGame } from "../packets.js";
import { onRelease } from "../util.js";

export const Lobby = (data = {}) => {
	const { socket = null, state = 0 } = data;

	return $(
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
	);
};
