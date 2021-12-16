import { v4 as uuidv4 } from "uuid";

import Packet from "../../../common/packets/Packet";
import Client from "../../clients/Client";

import RoomInfo from "../../rooms/RoomInfo";
import RoomManager from "../../rooms/RoomManager";

import validateFields from "../../validation/validateFields";
import applyDefaults from "../../../common/validation/applyDefaults";
import roomInfoFields from "../../../common/validation/fields/roomInfo";

import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";


const createRoomHandler = ( packet: Packet, client: Client ) =>
{
	const { body } = packet;
	const validation = validateFields (body, roomInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (packet, validation);
		return;
	}

	if ( client.roomID !== "" )
	{
		client.packets.sendRejectPacket (packet, getRoomErrorMessage (RoomError.InRoom));
		return;
	}

	const info: any = applyDefaults (body, roomInfoFields);

	// TODO: Add chat capabilities and remove this.
	info.enableChat = false;
	// TODO: Add ability to not show on room list and to join directly from an ID.
	info.showOnList = true;

	const room = RoomManager.create (new RoomInfo (info), client);

	RoomManager.joinRoom (room.id, client);
	client.packets.sendAcceptPacket (packet, room.id);

	room.startPhase ();
};


export default createRoomHandler;
