/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState, $singleton, $ } from "../framework.js";
import { Button, Div, Section, Span, Strong } from "../util/components.js";
import { copyText } from "../util/util.js";
import { RoomStates, RoomData, ShowPopup } from "./state.js";

export const Header = $singleton({
	$element() {
		const ShowRoomID = createState(false);

		const labels = { timeLeft: Strong("Time Left: "), round: Strong("Round: "), id: Strong("Code: ") };
		const fields = {
			timeLeft: Span(),
			round: Span(),
			roundLimit: Span(),
			id: Button("", "room-id", () => ShowRoomID.set(!ShowRoomID.get())),
		};

		const copyButton = Button("Copy", async () => {
			if (!(await copyText(RoomData.id.get()))) {
				alert("Copying text is not supported by your browser at this time.");
			}
		});

		const containers = {
			time: Div(labels.timeLeft, fields.timeLeft),
			round: Div(labels.round, fields.round, " / ", fields.roundLimit),
			id: Div(labels.id, $("small", fields.id, copyButton)),
		};

		Object.keys(RoomData).forEach(key => {
			switch (key) {
				case "id": {
					const hook = () => {
						fields.id.textContent = ShowRoomID.get()
							? RoomData.id.get()
							: RoomData.id.get().replaceAll(/./g, "•");
					};

					RoomData.id.addHook(hook);
					ShowRoomID.addHook(hook);

					break;
				}

				case "state": {
					RoomData.state.addHook(state => {
						const { time, round } = containers;

						if (state === RoomStates.Lobby || state === RoomStates.StartGame) {
							round.classList.add("hidden");
						} else {
							round.classList.remove("hidden");
						}

						if (state === RoomStates.Lobby) {
							time.classList.add("hidden");
						} else {
							time.classList.remove("hidden");
						}
					});

					break;
				}

				case "timeLeft": {
					const hook = () => {
						const state = RoomData.state.get();
						const timeLeft = RoomData.timeLeft.get();

						if (timeLeft <= 10 && (state === RoomStates.Create || state === RoomStates.Vote)) {
							labels.timeLeft.classList.add("danger");
							fields.timeLeft.classList.add("danger");
						} else {
							labels.timeLeft.classList.remove("danger");
							fields.timeLeft.classList.remove("danger");
						}

						labels.timeLeft.textContent =
							state === RoomStates.StartGame ? "Starting game in " : "Time Left: ";
						fields.timeLeft.textContent = `${timeLeft}`;
					};

					RoomData.state.addHook(hook);
					RoomData.timeLeft.addHook(hook);

					break;
				}

				default: {
					if (Object.hasOwn(fields, key)) {
						RoomData[key].addHook(value => {
							fields[key].textContent = `${value}`;
						});
					}

					break;
				}
			}
		});

		return Section(
			Button("« Exit", "tab warning", () => ShowPopup.set(true)),
			Section(
				{ className: "container room-header" },
				Section({ className: "room-data-fields" }, containers.time, containers.round, containers.id),
			),
		);
	},
});
