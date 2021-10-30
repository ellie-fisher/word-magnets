import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";
import RegistrationModel from "../../registration/RegistrationModel";


packetManager.on (PacketCommand.RegisterInfo, ( packet: Packet ) =>
{
	const { body } = packet;

	if ( body.ok )
	{
		RegistrationModel.error = "";
		AppModel.view = ViewEnum.MainMenu;
	}
	else
	{
		const { data } = body;

		if ( Array.isArray (data) )
		{
			if ( body.data.length === 1 )
			{
				RegistrationModel.error = body.data[0];
			}
			else if ( body.data.length > 1 )
			{
				RegistrationModel.error = `Field \`${body.data[0]}\` - ${body.data[1]}`;
			}
		}
		else
		{
			RegistrationModel.error = data;
		}
	}
});
