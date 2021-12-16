import Packet from "../../../../common/packets/Packet";
import PacketType from "../../../../common/packets/PacketType";
import PacketCommand from "../../../../common/packets/PacketCommand";

import CreatePhaseController from "../CreatePhaseController";
import CreatePhaseModel from "../CreatePhaseModel";

import packetManager from "../../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.Wordbanks, ( packet: Packet ) =>
{
	CreatePhaseController.clearWordbanks ();
	CreatePhaseModel.wordbanks = packet.body || [];
});
