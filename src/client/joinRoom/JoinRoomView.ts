import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import JoinRoomController from "./JoinRoomController";
import ViewEnum from "../app/ViewEnum";

import "./handlers/JoinRoom";


const JoinRoomView: Component =
{
	view ()
	{
		return m ("div",
		[
			m ("h3", "Join a Room"),

			m ("div", "TBD"),  // TODO:
		]);
	},
};


export default JoinRoomView;
