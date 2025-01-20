import { deepStrictEqual } from "node:assert";
import { v4 as uuid } from "uuid";
import { Packet } from "../../src/common/packets/Packet";
import { PacketType } from "../../src/common/packets/PacketType";
import { RawPacket } from "../../src/common/packets/types";

export function ClientIDTest()
{
	const id = uuid();
	const raw = [PacketType.ClientID, id] as RawPacket;
	const packet = Packet.fromArray(raw);

	deepStrictEqual(raw, [PacketType.ClientID, id]);
	deepStrictEqual(Packet.toArray(PacketType.ClientID, packet), [PacketType.ClientID, id]);
	deepStrictEqual(packet.id, id);
};
