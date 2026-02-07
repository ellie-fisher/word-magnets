/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createEffect, createSignal, $, $replace } from "../framework.js";
import { Fields } from "../fields.js";
import { onPress, onRelease } from "../util.js";
import { hidePopup, popupData, setPopupData, showYesNoPopup } from "../popup.js";

const [roomData, _setRoomData] = createSignal({
	id: "",
	state: 0,
	timeLeft: Fields.createRoom.find(field => field.id === "timeLimit")?.default ?? 0,
	timeLimit: Fields.createRoom.find(field => field.id === "timeLimit")?.default ?? 0,
	round: 1,
	roundLimit: Fields.createRoom.find(field => field.id === "roundLimit")?.default ?? 1,
	clientLimit: Fields.createRoom.find(field => field.id === "clientLimit")?.default ?? 2,
});

const [showID, setShowID] = createSignal(false);
const [clients, setClients] = createSignal([]);

export const Room = (data = {}) => {
	const { socket = null } = data;

	const fields = {
		id: $("button", {
			className: "small room-id",
			...onPress(() => {
				setShowID(true);
			}),
			...onRelease(() => {
				setShowID(false);
			}),
			onmouseleave() {
				setShowID(false);
			},
		}),
		timeLeft: $("span"),
		round: $("span"),
		roundLimit: $("span"),
	};

	// We have these functions reassignable so we can change them when their values change.
	let copyRoomID = () => {};

	const header = [
		$("div", $("strong", "Time Left: "), fields.timeLeft),
		$("div", $("strong", "Round: "), fields.round, " / ", fields.roundLimit),
		$(
			"div",
			{ className: "" },
			$("strong", "Room ID: "),
			$(
				"small",
				fields.id,
				$(
					"button",
					{
						...onRelease(() => {
							copyRoomID();
						}),
					},
					"Copy",
				),
			),
		),
	];

	createEffect(() => {
		const _roomData = roomData();
		const copy = { ..._roomData };

		if (!showID()) {
			copy.id = copy.id.replaceAll(/[a-zA-Z0-9]/g, "•");
		}

		copyRoomID = () => {
			navigator.clipboard.writeText(_roomData.id);
		};

		Object.keys(fields).forEach(key => {
			fields[key].textContent = `${copy[key]}`;
		});
	});

	const players = $("div");

	createEffect(() => {
		$replace(
			players,
			$("strong", "Players: "),
			...clients().map(({ id, name }) =>
				$("button", { className: "word-tile", title: id }, name),
			),
		);
	});

	return $(
		"article",
		$("h1", "Lobby"),
		$(
			"section",
			$(
				"button",
				{
					className: "tab warning",
					...onRelease(() => {
						showYesNoPopup("Exit Room?", "Are you sure you want to exit the room?");
					}),
				},
				"« Exit",
			),
			$("section", { className: "container room-header" }, ...header),
			$("p", players),
		),
	);
};

export const setRoomData = _setRoomData;
export const setRoomClients = setClients;
