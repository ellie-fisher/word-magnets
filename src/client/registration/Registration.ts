import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import registrationState from "./state";
import "./handlers/RegisterInfo";


const Registration: Component =
{
	view ()
	{
		return m ("div",
		[
			m ("h3", "Enter Your Username"),
			m ("p",
			[
				m ("label", "Username: "),
				m ("input",
				{
					type: "text",
					oninput ( event )
					{
						registrationState.info.name = event.target.value;
					},
					onchange ( event )
					{
						registrationState.info.name = event.target.value;
					},
				}),
				m ("button",
				{
					onclick ( event )
					{
						packetManager.sendRequestPacket (PacketCommand.RegisterInfo, registrationState.info);
					},
				}, "Register"),
			]),
			m ("p", m("strong", registrationState.error)),
		]);
	},
};


export default Registration;
