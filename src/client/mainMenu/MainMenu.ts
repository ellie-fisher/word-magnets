import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

// import registrationState from "./state";
// import "./handlers/RegisterInfo";


const MainMenu: Component =
{
	view ()
	{
		return m ("div",
		[
			m ("h1", "Farragomate"),

			m ("p", m ("button", "Create Room")),
			m ("p", m ("button", "Join Room")),
			m ("p", m ("button", "Change Name")),
		]);
	},
};


export default MainMenu;
