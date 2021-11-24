import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import RoomModel from "../RoomModel";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketCommand.RoomInfo, ( packet: Packet ) =>
{
	const { body } = packet;

	console.log ("ROOM INFO:", body);

	Object.keys (body).forEach (key =>
	{
		RoomModel.info[key] = body[key];
	});
});
