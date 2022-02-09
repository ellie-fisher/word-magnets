import store from "../store";

import Packet from "../../common/packets/Packet";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";

import RoomActions from "./actionCreators";

import packetManager from "../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.clientJoinRoom (packet.body));
});
