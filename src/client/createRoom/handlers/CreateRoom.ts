import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";
import CreateRoomModel from "../../createRoom/CreateRoomModel";


packetManager.on (PacketType.Response, PacketCommand.CreateRoom, ( packet: Packet ) =>
{
	const { body } = packet;

	if ( body.ok )
	{
		CreateRoomModel.error = [];
	}
	else
	{
		CreateRoomModel.error = body.data;
	}
});
