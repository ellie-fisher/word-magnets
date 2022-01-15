import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import JoinRoomModel from "./JoinRoomModel";
import JoinRoomController from "./JoinRoomController";
import ViewEnum from "../app/ViewEnum";

import "./handlers/JoinRoom";


const JoinRoomView: Component =
{
	oninit()
	{
		JoinRoomController.setToDefaults ();
	},

	view ()
	{
		return m ("div",
		[
			m ("button",
			{
				onclick ()
				{
					AppModel.view = ViewEnum.MainMenu;
				},
			},
			"<< Back"),

			m ("h3", "Join a Room"),

			m ("p",
			[
				m ("label", "Username: "),

				m ("input",
				{
					type: "text",
					value: AppModel.clientName,
					autocomplete: "off",
					maxLength: 24,

					oninput ( event )
					{
						AppModel.clientName = event.target.value;
					},

					onchange ( event )
					{
						AppModel.clientName = event.target.value;
					},
				}),
			]),

			m ("input",
			{
				type: "text",

				oninput ( event )
				{
					JoinRoomModel.roomID = event.target.value;
				},

				value: JoinRoomModel.roomID,
			}),

			m ("div", m ("strong", JSON.stringify (JoinRoomModel.error))),

			m ("button",
			{
				onclick ()
				{
					JoinRoomController.joinRoom ();
				}
			},
			"Join Room"),
		]);
	},
};


export default JoinRoomView;
