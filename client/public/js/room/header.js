/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createEffect, createSignal, $, $replace } from "../framework.js";
import { onPress, onRelease } from "../util.js";
import { showYesNoPopup } from "../popup.js";
import { RoomStates, sendLeaveRoom } from "../packets.js";
import { getRoomData, getClients } from "./state.js";
import { setAppView } from "../app.js";

const [showID, setShowID] = createSignal(false);

export const Header = (data = {}) => {
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

	const labels = { id: $("strong", "Code: "), timeLeft: $("strong", "Time Left: "), round: $("strong", "Round: ") };

	// We have these functions reassignable so we can change them when their values change.
	let copyRoomID = () => {};

	const header = [
		$("div", labels.timeLeft, fields.timeLeft),
		$("div", labels.round, fields.round, " / ", fields.roundLimit),
		$(
			"div",
			labels.id,
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
		const _roomData = getRoomData();
		const copy = { ..._roomData };

		if (!showID()) {
			copy.id = copy.id.replaceAll(/./g, "•");
		}

		copyRoomID = () => {
			navigator.clipboard.writeText(_roomData.id);
		};

		if (copy.timeLeft <= 10 && (copy.state === RoomStates.Create || copy.state === RoomStates.Vote)) {
			labels.timeLeft.classList.add("danger");
			fields.timeLeft.classList.add("danger");
		} else {
			labels.timeLeft.classList.remove("danger");
			fields.timeLeft.classList.remove("danger");
		}

		Object.keys(fields).forEach(key => {
			fields[key].textContent = `${copy[key]}`;
		});
	});

	return $(
		"section",
		$(
			"button",
			{
				className: "tab warning",
				...onRelease(() => {
					showYesNoPopup("Exit Room?", "Are you sure you want to exit the room?", () => {
						setAppView("title", { socket });
						sendLeaveRoom(socket);
						return true;
					});
				}),
			},
			"« Exit",
		),
		$(
			"section",
			{ className: "container room-header" },
			$("section", { className: "room-data-fields" }, ...header),
		),
	);
};
