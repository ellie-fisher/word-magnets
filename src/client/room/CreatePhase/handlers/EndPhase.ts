import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import CreatePhaseModel from "../CreatePhaseModel";
import CreatePhaseController from "../CreatePhaseController";

import RoomPhaseType from "../../../../common/rooms/phases/RoomPhaseType";
import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.EndPhase, ( packet: Packet ) =>
{
	if ( packet.body === RoomPhaseType.Create )
	{
		packetManager.sendRequestPacket (PacketCommand.SendSentence, CreatePhaseModel.sentence);
		CreatePhaseController.clearWordbanks ();
	}
});
