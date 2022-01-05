import Packet from "../../../common/packets/Packet";
import Client from "../../clients/Client";

import Room from "../../rooms/Room";
import RoomInfo from "../../rooms/RoomInfo";
import RoomManager from "../../rooms/RoomManager";

import validateFields from "../../validation/validateFields";
import applyDefaults from "../../../common/validation/applyDefaults";
import roomInfoFields from "../../../common/validation/fields/roomInfo";

import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";

import { ObjectCreateError } from "../../misc/ObjectManager";


const createRoomHandler = ( packet: Packet, client: Client ) =>
{
	const { body } = packet;
	const validation = validateFields (body, roomInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (packet, validation);
		return;
	}

	if ( client.isInRoom () )
	{
		client.packets.sendRejectPacket (packet, getRoomErrorMessage (RoomError.InRoom));
		return;
	}

	const info: any = applyDefaults (body, roomInfoFields);

	// TODO: Add chat capabilities and remove this.
	info.enableChat = false;
	// TODO: Add ability to not show on room list and to join directly from an ID.
	info.showOnList = true;

	const roomOrError = RoomManager.create (new RoomInfo (info), client);

	if ( !(roomOrError instanceof Room) )
	{
		client.packets.sendRejectPacket (
			packet,
			RoomManager.getCreateErrorMessage (roomOrError as ObjectCreateError),
		);

		return;
	}

	const room = roomOrError as Room;

	RoomManager.joinRoom (room.id, client);
	client.packets.sendAcceptPacket (packet, room.id);

	room.startPhase ();
};


export default createRoomHandler;
