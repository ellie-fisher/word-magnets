import m, { Component } from "mithril";

import AppModel from "../app/AppModel";
import RoomDestroyedModel from "./RoomDestroyedModel";

import ViewEnum from "../app/ViewEnum";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import "./handlers/DestroyRoom";


const RoomDestroyedView: Component =
{
	view ()
	{
		return m ("div",
		[
			m ("h1", "Room Closed"),
			m ("p", RoomDestroyedModel.reason),

			m ("button",
			{
				onclick ()
				{
					AppModel.view = ViewEnum.MainMenu;
				},
			},
			"OK"),
		]);
	},
};


export default RoomDestroyedView;
