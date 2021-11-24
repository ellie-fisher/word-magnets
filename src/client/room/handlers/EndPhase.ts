import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomModel from "../RoomModel";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketCommand.EndPhase, ( packet: Packet ) =>
{
	RoomModel.isPhaseEnd = true;
});
