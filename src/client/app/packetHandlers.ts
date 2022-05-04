import store from "../store";

import Packet from "../../common/packets/Packet";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";

import AppActions from "./actionCreators";

import packetManager from "../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.ClientConnected, ( packet: Packet ) =>
{
	store.dispatch (AppActions.clientID (packet.body));
});
