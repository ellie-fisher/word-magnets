import Packet from "../../packets/Packet";
import Client from "../../clients/Client";

import RoomManager from "../../rooms/RoomManager";
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
