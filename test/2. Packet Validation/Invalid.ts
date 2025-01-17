import { deepStrictEqual } from "node:assert";
import { Invalid } from "../../src/common/packets/Invalid";
import { PacketType } from "../../src/common/packets/PacketType";

export function InvalidTest()
{
	const packet = new Invalid();
	const packed = packet.toArray();

	deepStrictEqual(packed, [PacketType.Invalid]);
	deepStrictEqual(packet.type, PacketType.Invalid);
};
