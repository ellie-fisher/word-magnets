import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import VotePhaseController from "../VotePhaseController";

import RoomPhaseType from "../../../../common/rooms/phases/RoomPhaseType";
import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.SentenceList, ( packet: Packet ) =>
{
	VotePhaseController.setSentenceList (packet.body);
});
