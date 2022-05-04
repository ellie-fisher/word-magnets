import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import CreateRoomActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Response, PacketCommand.CreateRoom, ( packet: Packet ) =>
{
	store.dispatch (CreateRoomActions.createRoomResponse (packet.body));
});
