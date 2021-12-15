import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import CreatePhaseModel from "../CreatePhaseModel";
import CreatePhaseController from "../CreatePhaseController";

import RoomPhaseType from "../../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../../common/rooms/phases/RoomPhaseState";

import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.PhaseData, ( packet: Packet ) =>
{
	if ( packet.body.type === RoomPhaseType.Create && packet.body.state === RoomPhaseState.End )
	{
		packetManager.sendRequestPacket (PacketCommand.SendSentence, CreatePhaseModel.sentence);
	}
});
