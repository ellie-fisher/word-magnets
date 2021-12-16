import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketType.Response, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	const { body } = packet;

	if ( body.ok )
	{
		AppModel.view = ViewEnum.Room;
	}
});
