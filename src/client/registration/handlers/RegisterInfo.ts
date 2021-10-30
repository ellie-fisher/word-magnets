import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import AppView from "../../app/AppView";
import appState from "../../app/state";
import packetManager from "../../packets/packetManager";
import registrationState from "../../registration/state";


packetManager.on (PacketCommand.RegisterInfo, ( packet: Packet ) =>
{
	const { body } = packet;

	if ( body.ok )
	{
		registrationState.error = "";
		appState.view = AppView.MainMenu;
	}
	else if ( body.data.length === 1 )
	{
		registrationState.error = body.data[0];
	}
	else if ( body.data.length > 1 )
	{
		registrationState.error = `Field \`${body.data[0]}\` - ${body.data[1]}`;
	}
});
