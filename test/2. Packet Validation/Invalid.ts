import { deepStrictEqual } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
import { PacketType } from "../../src/common/packets/PacketType";
import { RawPacket } from "../../src/common/packets/types";

export function InvalidTest()
{
	const raw = [PacketType.Invalid] as RawPacket;
	const packet = Packet.fromArray(raw);

	deepStrictEqual(raw, [PacketType.Invalid]);
	deepStrictEqual(Packet.toArray(PacketType.Invalid, packet), [PacketType.Invalid]);
};
