import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ResultsPhaseActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.SentenceScores, ( packet: Packet ) =>
{
	store.dispatch (ResultsPhaseActions.sentences (packet.body));
});
