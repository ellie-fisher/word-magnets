import Packet from "../../../common/packets/Packet";

import Client from "../../clients/Client";
import ClientInfo from "../../clients/ClientInfo";

import RoomManager from "../../rooms/RoomManager";
import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";

import validateFields from "../../validation/validateFields";
import clientInfoFields from "../../../common/validation/fields/clientInfo";


const joinRoomHandler = ( packet: Packet, client: Client ) =>
{
	// TODO: Validation for all expected packet body formats.

	const { roomID, clientInfo } = packet.body;

	const validation = validateFields (clientInfo, clientInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (packet, validation);
		return;
	}

	client.info = new ClientInfo (clientInfo);

	const error = RoomManager.joinRoom (roomID, client);

	if ( error === RoomError.Ok )
	{
		client.packets.sendAcceptPacket (packet);
	}
	else
	{
		client.packets.sendRejectPacket (packet, getRoomErrorMessage (error));
	}
};


export default joinRoomHandler;
