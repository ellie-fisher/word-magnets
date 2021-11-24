import Packet from "../../../../common/packets/Packet";
import PacketCommand from "../../../../common/packets/PacketCommand";

import CreatePhaseModel from "../CreatePhaseModel";
import packetManager from "../../../packets/packetManager";


packetManager.on (PacketCommand.Wordbanks, ( packet: Packet ) =>
{
	CreatePhaseModel.wordbanks = packet.body || [];
});
