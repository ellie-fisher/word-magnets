import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";

import has from "../../../common/util/has";


packetManager.on (PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	const { body } = packet;

	if ( packet.type === PacketType.Data || body.ok )
	{
		AppModel.view = ViewEnum.Room;
	}
});
