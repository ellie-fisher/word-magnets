import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomModel from "../RoomModel";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketCommand.StartPhase, ( packet: Packet ) =>
{
	RoomModel.phase = packet.body;
	RoomModel.isPhaseEnd = false;
});
