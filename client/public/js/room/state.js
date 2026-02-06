/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

export const RoomState = new State({
	id: "",
	state: 0,
	timeLeft: Fields.createRoom.find(field => field.id === "timeLimit")?.default ?? 0,
	timeLimit: Fields.createRoom.find(field => field.id === "timeLimit")?.default ?? 0,
	round: 1,
	roundLimit: Fields.createRoom.find(field => field.id === "roundLimit")?.default ?? 1,
	clientLimit: Fields.createRoom.find(field => field.id === "clientLimit")?.default ?? 2,
	clients: [],
});
