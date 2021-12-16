import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import ResultsPhaseController from "../ResultsPhaseController";

import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.SentenceScores, ( packet: Packet ) =>
{
	ResultsPhaseController.clearSentenceScores ();
	ResultsPhaseController.setSentenceScores (packet.body);
});
