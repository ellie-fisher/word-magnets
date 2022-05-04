import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import GameEndPhaseActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.FinalScores, ( packet: Packet ) =>
{
	store.dispatch (GameEndPhaseActions.scores (packet.body));
});
