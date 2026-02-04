/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const CreateJoinView = (data = {}) => {
	const updateTabs = showCreate => {
		createView.hidden = !showCreate;
		createButton.disabled = showCreate;
		joinView.hidden = showCreate;
		joinButton.disabled = !showCreate;
	};

	const createView = CreateRoomView(data);
	const createButton = createElement("input", {
		type: "button",
		className: "tab",
		value: "Create",
		onclick() {
			updateTabs(true);
		},
	});
	const joinView = JoinRoomView(data);
	const joinButton = createElement("input", {
		type: "button",
		className: "tab",
		value: "Join",
		onclick() {
			updateTabs(false);
		},
	});

	updateTabs(true);

	return combineElements("article", createButton, joinButton, createView, joinView);
};
