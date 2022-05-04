import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import VotePhaseActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.SentenceList, ( packet: Packet ) =>
{
	store.dispatch (VotePhaseActions.sentences (packet.body));
});
