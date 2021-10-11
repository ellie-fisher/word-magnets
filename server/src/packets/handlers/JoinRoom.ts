import Room from "../../rooms/Room";
import RoomInfo from "../../rooms/RoomInfo";
import RoomManager from "../../rooms/RoomManager";

import Client from "../../clients/Client";
import Packet from "../../packets/Packet";

import validateFields from "../../validation/validateFields";
import applyDefaults from "../../validation/applyDefaults";
import roomInfoFields from "../../validation/fields/roomInfo";

import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";


const joinRoomHandler = ( packet: Packet, client: Client ) =>
{
	const error = RoomManager.joinRoom (packet.body, client);

	if ( error === RoomError.Ok )
	{
		client.packets.sendAcceptPacket (client.socket, packet);
	}
	else
	{
		client.packets.sendRejectPacket (client.socket, packet, getRoomErrorMessage (error));
	}
};


export default joinRoomHandler;
