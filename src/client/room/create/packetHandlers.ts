import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import CreatePhaseActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.Wordbanks, ( packet: Packet ) =>
{
	store.dispatch (CreatePhaseActions.wordbanks (packet.body));
});
