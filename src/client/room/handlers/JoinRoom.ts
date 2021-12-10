import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";

import RoomController from "../RoomController";


packetManager.on (PacketType.Data, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	if ( packet.body.id === AppModel.clientID )
	{
		AppModel.view = ViewEnum.Room;
	}

	RoomController.addClient ({ ...packet.body });
});
