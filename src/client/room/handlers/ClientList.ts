import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomController from "../RoomController";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.ClientList, ( packet: Packet ) =>
{
	RoomController.setClients (packet.body);
});
