import Packet from "../../../common/packets/Packet";
import PacketHandler from "../../../common/packets/PacketHandler";

import Client from "../../clients/Client";
import ClientInfo from "../../clients/ClientInfo";

import Room from "../../rooms/Room";
import RoomInfo from "../../rooms/RoomInfo";
import RoomManager from "../../rooms/RoomManager";

import validateFields from "../../validation/validateFields";
import applyDefaults from "../../../common/validation/applyDefaults";
import roomInfoFields from "../../../common/validation/fields/roomInfo";
import clientInfoFields from "../../../common/validation/fields/clientInfo";

import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";

import { ObjectCreateError } from "../../misc/ObjectManager";
import { ValidationData } from "../../../common/validation/types";


const createRoomHandler = new PacketHandler (
{
	fields:
	{
		roomInfo: { type: "object", required: true },
		clientInfo: { type: "object", required: true },
	},

	validationFailed ( packet: Packet, client: Client, data: ValidationData )
	{
		client.packets.sendRejectPacket (packet, data);
	},

	handler ( packet: Packet, client: Client )
	{
		const { body } = packet;
		const { clientInfo } = body;
		let { roomInfo } = body;

		let validation = validateFields (clientInfo, clientInfoFields);

		if ( !validation[0] )
		{
			client.packets.sendRejectPacket (packet, { which: "clientInfo", validation: validation[1] });
			return;
		}

		validation = validateFields (roomInfo, roomInfoFields);

		if ( !validation[0] )
		{
			client.packets.sendRejectPacket (packet, { which: "roomInfo", validation: validation[1] });
			return;
		}

		if ( client.isInRoom () )
		{
			client.packets.sendRejectPacket (packet, getRoomErrorMessage (RoomError.InRoom));
			return;
		}

		roomInfo = applyDefaults (roomInfo, roomInfoFields);

		const roomOrError = RoomManager.create (new RoomInfo (roomInfo), client);

		if ( !(roomOrError instanceof Room) )
		{
			client.packets.sendRejectPacket (
				packet,
				RoomManager.getCreateErrorMessage (roomOrError as ObjectCreateError),
			);

			return;
		}

		client.info = new ClientInfo (clientInfo);

		const room: Room = roomOrError;

		RoomManager.joinRoom (room.id, client);

		// TODO: Remove sending the room ID to make it clearer that the `JoinRoom` data packet is
		//       where all the view-changing logic should be.
		client.packets.sendAcceptPacket (packet, room.id);

		room.startPhase ();
	},
});


export default createRoomHandler;
