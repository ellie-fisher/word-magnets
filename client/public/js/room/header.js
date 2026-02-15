/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createEffect, createSignal, $ } from "../framework.js";
import { onPress, onRelease } from "../util.js";
import { showYesNoPopup } from "../popup.js";
import { RoomStates, sendLeaveRoom } from "../packets.js";
import { RoomData } from "./state.js";
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

	Object.keys(RoomData.get).forEach(key => {
		switch (key) {
			case "id": {
				createEffect(() => {
					const original = RoomData.get.id();
					let id = original;

					if (!showID()) {
						id = id.replaceAll(/./g, "•");
					}

					copyRoomID = () => {
						navigator.clipboard.writeText(original);
					};

					fields.id.textContent = id;
				});

				break;
			}

			case "timeLeft": {
				createEffect(() => {
					const timeLeft = RoomData.get.timeLeft();
					const state = RoomData.get.state();

					if (timeLeft <= 10 && (state === RoomStates.Create || state === RoomStates.Vote)) {
						labels.timeLeft.classList.add("danger");
						fields.timeLeft.classList.add("danger");
					} else {
						labels.timeLeft.classList.remove("danger");
						fields.timeLeft.classList.remove("danger");
					}

					fields.timeLeft.textContent = `${timeLeft}`;
				});

				break;
			}

			default: {
				if (Object.hasOwn(fields, key)) {
					createEffect(() => {
						fields[key].textContent = `${RoomData.get[key]()}`;
					});
				}

				break;
			}
		}
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
