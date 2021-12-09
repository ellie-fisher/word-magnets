import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomModel from "../RoomModel";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.EndPhase, ( packet: Packet ) =>
{
	RoomModel.isPhaseEnd = true;
});
