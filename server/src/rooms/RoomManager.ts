import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import Room from "./Room";
import RoomInfo from "./RoomInfo";
import RoomError from "./RoomError";

import ObjectManager from "../misc/ObjectManager";

import Client from "../clients/Client";
import ClientManager from "../clients/ClientManager";
import PacketCommand from "../packets/PacketCommand";


const DEFAULT_MAX_ROOMS = 20;

class _RoomManager extends ObjectManager<Room>
{
	protected _create ( id: string, info: RoomInfo, owner: Client ): Room
	{
		return new Room (id, info, owner, room =>
		{
			this.remove (id);
		});
	}

	joinRoom ( id: string, client: Client ): RoomError
	{
		if ( !this.has (id) )
		{
			return RoomError.NotFound;
		}

		if ( client.roomID !== "" )
		{
			return RoomError.InRoom;
		}

		const room = this.get (id);

		if ( room.isFull () )
		{
			return RoomError.Full;
		}

		if ( room.clients.addClient (client) )
		{
			room.sendDataPacket (PacketCommand.JoinRoom, client.id);
			room.sendInfo (client);
			room.sendClientList (client);
		}

		return RoomError.Ok;
	}

	leaveRoom ( client: Client )
	{
		const { roomID } = client;

		if ( !this.has (roomID) )
		{
			return;
		}

		const room = this.get (roomID);

		if ( room.clients.isOwner (client) )
		{
			room.destroy ("The room was closed.");
		}
		else
		{
			room.sendDataPacket (PacketCommand.LeaveRoom, client.id, [client.id]);
			room.clients.removeClient (client.id);
		}
	}
}

const RoomManager = new _RoomManager (DEFAULT_MAX_ROOMS);


export default RoomManager;

export { DEFAULT_MAX_ROOMS };
