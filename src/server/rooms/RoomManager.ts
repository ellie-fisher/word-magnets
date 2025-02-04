import { CreateRoom } from './../../common/packets/CreateRoom';
import { UnpackedPacket } from "../../common/packets/types";
import { Client } from "../Client";
import { Room } from "./Room";
import { RoomData } from "./RoomData";
import { PacketType } from "../../common/packets/PacketType";
import { RoomFields } from "../../common/fields/fields";
import { FieldValidationResult } from "../../common/fields/Field";
import { CreateRoomRejectedPacket } from "../packets/CreateRoomRejected";
import { JoinRoomRejectedPacket } from "../packets/JoinRoomRejected";

const ROOM_ID_LENGTH = 10;
const CREATE_ROOM_ATTEMPTS = 20;

// Only letters and numbers that can't be mistaken for each other.
const roomIDChars = "ACDEFGHJKLMNPQRTVWXY379";

const generateRoomID = () =>
{
	let roomID = "";

	for (let i = 0; i < ROOM_ID_LENGTH; i++)
	{
		roomID += roomIDChars[~~(Math.random() * roomIDChars.length)];
	}

	return roomID;
};

const rooms = new Map<string, Room>();

export const RoomManager =
{
	create(owner: Client, data: RoomData): boolean
	{
		if (owner.roomID !== "")
		{
			RoomManager.removeClient(owner);
		}

		let room: Room | null = null;

		for (let i = 0; i < CREATE_ROOM_ATTEMPTS && room === null; i++)
		{
			const id = generateRoomID();

			if (!rooms.has(id))
			{
				room = new Room(id, owner, data);
			}
		}

		const success = room !== null;

		if (success)
		{
			rooms.set((room as Room).id, (room as Room));
		}

		return success;
	},

	destroy(client: Client): void
	{
		const room = rooms.get(client.roomID) ?? null;

		if (room !== null)
		{
			room.destroy();
			rooms.delete(room.id);
		}
	},

	addClient(client: Client, roomID: string): boolean
	{
		if (client.roomID !== "")
		{
			RoomManager.removeClient(client);
		}

		const room = rooms.get(roomID) ?? null;

		room?.addClient(client);

		return room !== null;
	},

	removeClient(client: Client): void
	{
		const room = rooms.get(client.roomID) ?? null;

		if (room !== null)
		{
			if (room.owner === client)
			{
				RoomManager.destroy(client);
			}
			else
			{
				room.removeClient(client);
			}
		}
	},
};
