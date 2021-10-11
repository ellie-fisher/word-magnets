import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import Room from "./Room";
import RoomInfo from "./RoomInfo";

import ObjectManager from "../misc/ObjectManager";

import Client from "../clients/Client";
import PacketCommand from "../packets/PacketCommand";

import { DEFAULT_MAX_CLIENTS } from "../clients/ClientManager";


const DEFAULT_MAX_ROOMS = DEFAULT_MAX_CLIENTS;

class _RoomManager extends ObjectManager<Room>
{
	_create ( id: string, info: RoomInfo, owner: Client ): Room
	{
		return new Room (id, info, owner);
	}

	remove ( id: string )
	{
		if ( !this.has (id) )
		{
			return;
		}

		const room = this.get (id);

		room.sendDataPacket (PacketCommand.DestroyRoom);
		room.clients.clearClients ();

		super.remove (id);
	}
}

const RoomManager = new _RoomManager (DEFAULT_MAX_ROOMS);


export default RoomManager;

export { DEFAULT_MAX_ROOMS };
