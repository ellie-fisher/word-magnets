import { WebSocket } from "ws";
import { generate } from "randomstring";

import Room from "./Room";
import RoomInfo from "./RoomInfo";
import RoomError from "./RoomError";

import ObjectManager from "../misc/ObjectManager";

import Client from "../clients/Client";
import ClientManager from "../clients/ClientManager";
import PacketCommand from "../../common/packets/PacketCommand";

import serverConfig from "../config/serverConfig";

import { ObjectCreateError } from "../misc/ObjectManager";


const ROOM_ID_LENGTH = 5;
const ROOM_ID_MAX_GEN = 10;

class _RoomManager extends ObjectManager<Room>
{
	protected _create ( id: string, info: RoomInfo, owner: Client ): Room
	{
		return new Room (id, info, owner, room =>
		{
			this.remove (id);
		});
	}

	protected _generateID (): string
	{
		for ( let i = 0; i < ROOM_ID_MAX_GEN; i++ )
		{
			const id = generate (
			{
				length: ROOM_ID_LENGTH,
				charset: "alphanumeric",
				capitalization: "uppercase",
			});

			if ( !this.has (id) )
			{
				return id;
			}
		}

		return "";
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

	getCreateErrorMessage ( error: ObjectCreateError ): string
	{
		const { maxObjects } = this;

		switch ( error )
		{
			case ObjectCreateError.Ok:
				return "";

			case ObjectCreateError.ObjectLimit:
				return `The server can only support up to ${maxObjects} room${maxObjects != 1 ? "s" : ""}.`
					+ " Please try again later.";

			case ObjectCreateError.AlreadyExists:
				return "A room with your room's ID already exists in the room manager."
					+ " Please report this bug to the developers.";

			case ObjectCreateError.GenerateID:
				return "Failed to create a unique room ID. Please try again later.";

			default:
				return "Unknown object creation error.";
		}
	}
}

const RoomManager = new _RoomManager (serverConfig.limits.rooms);


export default RoomManager;
