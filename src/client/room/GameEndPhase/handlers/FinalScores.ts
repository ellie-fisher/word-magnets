import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import GameEndPhaseModel from "../GameEndPhaseModel";
import GameEndPhaseController from "../GameEndPhaseController";

import RoomPhaseType from "../../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../../common/rooms/phases/RoomPhaseState";

import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.FinalScores, ( packet: Packet ) =>
{
	GameEndPhaseController.setResults (packet.body);
});
