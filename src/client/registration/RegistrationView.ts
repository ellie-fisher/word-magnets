import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import RegistrationModel from "./RegistrationModel";
import "./handlers/RegisterInfo";


const RegistrationView: Component =
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
						RegistrationModel.info.name = event.target.value;
					},
					onchange ( event )
					{
						RegistrationModel.info.name = event.target.value;
					},
				}),
				m ("button",
				{
					onclick ( event )
					{
						packetManager.sendRequestPacket (PacketCommand.RegisterInfo, RegistrationModel.info);
					},
				}, "Register"),
			]),
			m ("p", m("strong", RegistrationModel.error)),
		]);
	},
};


export default RegistrationView;
