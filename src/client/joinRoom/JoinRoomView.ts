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

			m ("input",
			{
				type: "text",

				oninput ( event )
				{
					JoinRoomModel.roomID = event.target.value;
				},

				value: JoinRoomModel.roomID,
			}),

			m ("button",
			{
				onclick ()
				{
					JoinRoomController.joinRoom ();
				}
			},
			"Join Room"),

			m ("div", "TBD"),  // TODO: Replace temp components with room list
		]);
	},
};


export default JoinRoomView;
