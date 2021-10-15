import { v4 as uuidv4 } from "uuid";

import Packet from "../../../common/packets/Packet";
import Client from "../../clients/Client";

import RoomInfo from "../../rooms/RoomInfo";
import RoomManager from "../../rooms/RoomManager";

import validateFields from "../../validation/validateFields";
import applyDefaults from "../../validation/applyDefaults";
import roomInfoFields from "../../validation/fields/roomInfo";

import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";


const createRoomHandler = ( packet: Packet, client: Client ) =>
{
	const { body } = packet;
	const validation = validateFields (body, roomInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (client.socket, packet, validation);
		return;
	}

	if ( client.roomID !== "" )
	{
		client.packets.sendRejectPacket (client.socket, packet, getRoomErrorMessage (RoomError.InRoom));
		return;
	}

	const info: any = applyDefaults (body, roomInfoFields);

	// TODO: Add chat capabilities and remove this.
	info.enableChat = false;
	// TODO: Add ability to not show on server list and to join directly from an ID.
	info.showOnList = true;

	const room = RoomManager.create (new RoomInfo (info), client);

	RoomManager.joinRoom (room.id, client);
	client.packets.sendAcceptPacket (client.socket, packet, room.id);

	room.startPhase ();
};


export default createRoomHandler;
