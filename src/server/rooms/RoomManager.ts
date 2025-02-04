import { Client } from "../Client";
import { Room } from "./Room";
import { RoomData } from "./RoomData";
import { PacketType } from "../../common/packets/PacketType";
import { UnpackedPacket } from "../../common/packets/types";
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
				rooms.set(room.id, room);
			}
		}

		return room !== null;
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

	receivePacket(client: Client, packet: UnpackedPacket): void
	{
		switch (packet.type)
		{
			case PacketType.CreateRoom:
			{
				const { data = {} } = packet;
				const result = RoomFields.validate(data);

				let error = "";

				if (result[0] === FieldValidationResult.Success)
				{
					if (!RoomManager.create(client, data as RoomData))
					{
						error = "Could not generate a unique room code.";
					}
				}
				else
				{
					error = "Room configuration is invalid.";
				}

				if (error !== "")
				{
					client.send(CreateRoomRejectedPacket.pack(error));
				}

				break;
			}

			case PacketType.DestroyRoom:
			{
				const room = rooms.get(client.roomID) ?? null;

				if (room?.owner === client)
				{
					RoomManager.destroy(client);
				}

				break;
			}

			case PacketType.JoinRoom:
			{
				const room = rooms.get(packet.data?.id) ?? null;

				if (room !== null)
				{
					if (room.isFull)
					{
						client.send(JoinRoomRejectedPacket.pack("The room is full."));
					}
					else
					{
						RoomManager.addClient(client, room.id);
					}
				}

				break;
			}

			case PacketType.LeaveRoom:
			{
				RoomManager.removeClient(client);
				break;
			}

			case PacketType.RemoveClient:
			{
				const room = rooms.get(client.roomID) ?? null;

				if (room !== null && room.owner === client)
				{
					const target = room.getClient(packet.data?.id) ?? null;

					if (target !== null)
					{
						RoomManager.removeClient(target);
					}
				}

				break;
			}

			default:
			{
				rooms.get(client.roomID)?.receivePacket(client, packet);
				break;
			}
		}
	},
};
