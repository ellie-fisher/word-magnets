import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import ViewEnum from "../app/ViewEnum";


const MainMenuView: Component =
{
	view ()
	{
		return m ("div",
		[
			m ("h1", "Farragomate"),

			m ("p", m ("button", { onclick () { AppModel.view = ViewEnum.CreateRoom }}, "Create Room")),
			m ("p", m ("button", { onclick () { AppModel.view = ViewEnum.JoinRoom }}, "Join Room")),
			m ("p", m ("button", { onclick () { AppModel.view = ViewEnum.Registration }}, "Change Name")),
		]);
	},
};


export default MainMenuView;
