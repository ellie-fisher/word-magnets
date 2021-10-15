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

		return this.get (id).join (client);
	}

	leaveRoom ( client: Client )
	{
		const { roomID } = client;

		if ( !this.has (roomID) )
		{
			return;
		}

		this.get (roomID).leave (client);
	}
}

const RoomManager = new _RoomManager (DEFAULT_MAX_ROOMS);


export default RoomManager;

export { DEFAULT_MAX_ROOMS };
