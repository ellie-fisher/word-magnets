import Packet from "../../../common/packets/Packet";

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


const createRoomHandler = ( packet: Packet, client: Client ) =>
{
	// TODO: Validation for all expected packet body formats.

	const { body } = packet;
	const { clientInfo } = body;

	let validation = validateFields (clientInfo, clientInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (packet, validation);
		return;
	}

	let { roomInfo } = body;

	validation = validateFields (roomInfo, roomInfoFields);

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

	roomInfo = applyDefaults (roomInfo, roomInfoFields);

	// TODO: Add chat capabilities and remove this.
	roomInfo.enableChat = false;
	// TODO: Add ability to not show on room list and to join directly from an ID.
	roomInfo.showOnList = true;

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

	const room = roomOrError as Room;

	RoomManager.joinRoom (room.id, client);
	client.packets.sendAcceptPacket (packet, room.id);

	room.startPhase ();
};


export default createRoomHandler;
