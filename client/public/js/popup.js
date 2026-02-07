/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $, $replace, createEffect, createSignal } from "./framework.js";
import { onRelease } from "./util.js";

const defaultData = { title: "Default Title Text", body: "Default Body Text", show: false };
const [_popupData, _setPopupData] = createSignal({ ...defaultData });

export const Popup = (data = {}) => {
	const title = $("h2");
	const body = $("p");
	const popup = $(
		"section",
		{ className: "popup" },
		$("p", { className: "container" }, title, body),
	);

	createEffect(() => {
		const data = _popupData();

		$replace(title, data.title);
		$replace(body, data.body);

		popup.style.visibility = data.show ? "visible" : "hidden";
	});

	return popup;
};

export const showYesNoPopup = (title, body, onClickYes = () => true, onClickNo = () => true) => {
	_setPopupData({
		show: true,
		title,
		body: $(
			"div",
			$("p", body),
			$(
				"p",
				$(
					"button",
					{
						className: "primary",
						...onRelease(() => {
							if (onClickYes()) {
								hidePopup();
							}
						}),
					},
					"Yes",
				),
				$(
					"button",
					{
						...onRelease(() => {
							if (onClickNo()) {
								hidePopup();
							}
						}),
					},
					"No",
				),
			),
		),
	});
};

export const showPopup = () => {
	_setPopupData({ ...defaultData, show: true });
};

export const hidePopup = () => {
	_setPopupData({ ...defaultData, show: false });
};

export const popupData = _popupData;
export const setPopupData = _setPopupData;
