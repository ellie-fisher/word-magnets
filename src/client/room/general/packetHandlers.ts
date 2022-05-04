import store from "../../store";

import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomActions from "./actionCreators";

import packetManager from "../../sockets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.JoinRoom, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.clientJoinRoom (packet.body));
});

packetManager.on (PacketType.Data, PacketCommand.LeaveRoom, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.clientLeaveRoom (packet.body));
});

packetManager.on (PacketType.Data, PacketCommand.DestroyRoom, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.destroyRoom (packet.body));
});

packetManager.on (PacketType.Data, PacketCommand.ClientList, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.clientList (packet.body));
});

packetManager.on (PacketType.Data, PacketCommand.RoomInfo, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.roomInfo (packet.body));
});

packetManager.on (PacketType.Data, PacketCommand.PhaseData, ( packet: Packet ) =>
{
	store.dispatch (RoomActions.phaseData (packet.body));
});
