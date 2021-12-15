import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomModel from "../RoomModel";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";

import packetManager from "../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.PhaseData, ( packet: Packet ) =>
{
	RoomModel.phaseType = packet.body.type;
	RoomModel.phaseState = packet.body.state;
});
