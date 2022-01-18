import Packet from "../../../common/packets/Packet";
import PacketHandler from "../../../common/packets/PacketHandler";

import Client from "../../clients/Client";
import ClientInfo from "../../clients/ClientInfo";

import RoomManager from "../../rooms/RoomManager";
import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";

import validateFields from "../../validation/validateFields";
import clientInfoFields from "../../../common/validation/fields/clientInfo";

import { ValidationData } from "../../../common/validation/types";


const joinRoomHandler = new PacketHandler (
{
	fields:
	{
		roomID: { type: "string", required: true },
		clientInfo: { type: "object", required: true },
	},

	validationFailed ( packet: Packet, client: Client, data: ValidationData )
	{
		client.packets.sendRejectPacket (packet, data);
	},

	handler ( packet: Packet, client: Client )
	{
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
	},
});


export default joinRoomHandler;
