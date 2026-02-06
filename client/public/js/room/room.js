/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createEffect, createSignal, createElement, combineElements } from "../framework.js";
import { Fields } from "../fields.js";

const [roomData, _setRoomData] = createSignal({
	id: "",
	state: 0,
	timeLeft: Fields.createRoom.find(field => field.id === "timeLimit")?.default ?? 0,
	timeLimit: Fields.createRoom.find(field => field.id === "timeLimit")?.default ?? 0,
	round: 1,
	roundLimit: Fields.createRoom.find(field => field.id === "roundLimit")?.default ?? 1,
	clientLimit: Fields.createRoom.find(field => field.id === "clientLimit")?.default ?? 2,
});

const [clients, setClients] = createSignal([]);

export const Room = (data = {}) => {
	const { socket = null } = data;

	const children = {
		id: createElement("div"),
		timeLeft: createElement("div"),
		timeLimit: createElement("div"),
		round: createElement("div"),
		roundLimit: createElement("div"),
		clientLimit: createElement("div"),
	};

	const players = createElement("ul");

	createEffect(() => {
		const _roomData = roomData();

		Object.keys(children).forEach(key => {
			children[key].textContent = `${key}: ${_roomData[key]}`;
		});
	});

	createEffect(() => {
		players.replaceChildren(
			...clients().map(({ id, name }) => combineElements("li", { title: id }, name)),
		);
	});

	return combineElements(
		"article",
		combineElements("div", ...Object.keys(children).map(key => children[key]), players),
	);
};

export const setRoomData = _setRoomData;
export const setRoomClients = setClients;
