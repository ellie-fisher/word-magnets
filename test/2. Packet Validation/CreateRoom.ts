import { deepStrictEqual } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
import { CreateRoom } from "../../src/common/packets/CreateRoom";
import { PacketType } from "../../src/common/packets/PacketType";
import { RawPacket } from "../../src/common/packets/types";

export function CreateRoomTest()
{
	/* Testing custom field values */
	{
		const raw = [PacketType.CreateRoom, "Room Creator", 90, 8, 10] as RawPacket;
		const packet = Packet.fromArray(raw);

		const { clientData, roomData } = packet;

		deepStrictEqual(raw, [PacketType.CreateRoom, "Room Creator", 90, 8, 10]);
		deepStrictEqual(Packet.toArray(PacketType.CreateRoom, packet), [PacketType.CreateRoom, "Room Creator", 90, 8, 10]);
		deepStrictEqual(clientData.name, "Room Creator");
		deepStrictEqual(roomData.timeLimit, 90);
		deepStrictEqual(roomData.maxRounds, 8);
		deepStrictEqual(roomData.maxPlayers, 10);
	}

	/* Testing default field values */
	{
		const packet = Packet.fromArray([PacketType.CreateRoom]);
		const { clientData, roomData } = packet;

		deepStrictEqual(Packet.toArray(PacketType.CreateRoom, packet), [PacketType.CreateRoom, "", 60, 5, 8]);
		deepStrictEqual(clientData.name, "");
		deepStrictEqual(roomData.timeLimit, 60);
		deepStrictEqual(roomData.maxRounds, 5);
		deepStrictEqual(roomData.maxPlayers, 8);
	}
};
