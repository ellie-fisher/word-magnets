import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import JoinRoomActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Response, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	store.dispatch (JoinRoomActions.joinRoomResponse (packet.body));
});
