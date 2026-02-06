/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const JoinRoomView = (data = {}) => {
	const { socket } = data;

	const fields = structuredClone(Fields.joinRoom);

	return combineElements(
		"section",
		RoomFieldsView({
			fields,
			socket,
			title: "Join a Room",
			buttonText: "Join Room",
			onButtonClick: sendJoinRoom,
		}),
	);
};
