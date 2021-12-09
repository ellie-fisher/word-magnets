import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";

import has from "../../../common/util/has";


packetManager.on (PacketType.Data, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	if ( packet.body.id === AppModel.clientID )
	{
		AppModel.view = ViewEnum.Room;
	}
});

packetManager.on (PacketType.Response, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	const { body } = packet;

	if ( body.ok )
	{
		AppModel.view = ViewEnum.Room;
	}
});
