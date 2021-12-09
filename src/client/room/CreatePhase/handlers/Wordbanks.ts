import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import CreatePhaseModel from "../CreatePhaseModel";
import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.Wordbanks, ( packet: Packet ) =>
{
	CreatePhaseModel.wordbanks = packet.body || [];
});
