import { deepStrictEqual } from "node:assert";
import { v4 as uuid } from "uuid";
import { ClientID } from "../../src/common/packets/ClientID";
import { PacketType } from "../../src/common/packets/PacketType";

export function ClientIDTest()
{
	const packet = new ClientID();
	const id = uuid();

	packet.fromArray([PacketType.ClientID, id]);

	deepStrictEqual(packet.toArray(), [PacketType.ClientID, id]);
	deepStrictEqual(packet.type, PacketType.ClientID);
	deepStrictEqual(packet.id, id);
};
