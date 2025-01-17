import { deepStrictEqual } from "node:assert";
import { CreateRoom } from "../../src/common/packets/CreateRoom";
import { PacketType } from "../../src/common/packets/PacketType";

export function CreateRoomTest()
{
	/* Testing custom field values */
	{
		const packet = new CreateRoom();

		packet.fromArray([PacketType.CreateRoom, "Room Creator", 90, 8, 10]);

		const { clientData, roomData } = packet;

		deepStrictEqual(packet.toArray(), [PacketType.CreateRoom, "Room Creator", 90, 8, 10]);
		deepStrictEqual(packet.type, PacketType.CreateRoom);
		deepStrictEqual(clientData.name, "Room Creator");
		deepStrictEqual(roomData.timeLimit, 90);
		deepStrictEqual(roomData.maxRounds, 8);
		deepStrictEqual(roomData.maxPlayers, 10);
	}

	/* Testing default field values */
	{
		const packet = new CreateRoom();

		packet.fromArray([PacketType.CreateRoom]);

		const { clientData, roomData } = packet;

		deepStrictEqual(packet.toArray(), [PacketType.CreateRoom, "", 60, 5, 8]);
		deepStrictEqual(packet.type, PacketType.CreateRoom);
		deepStrictEqual(clientData.name, "");
		deepStrictEqual(roomData.timeLimit, 60);
		deepStrictEqual(roomData.maxRounds, 5);
		deepStrictEqual(roomData.maxPlayers, 8);
	}
};
