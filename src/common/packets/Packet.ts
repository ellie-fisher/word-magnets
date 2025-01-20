import { PacketType } from "./PacketType";

import { AnyObject } from "./../util";
import { PacketConverter, RawPacket } from "./types";

import { Invalid } from "./Invalid";
import { ClientID } from "./ClientID";
import { CreateRoom } from "./CreateRoom";

const typeToField = new Map<PacketType, PacketConverter>(
[
	[PacketType.Invalid, Invalid],
	[PacketType.ClientID, ClientID],
	[PacketType.CreateRoom, CreateRoom],
]);

export const Packet =
{
	fromArray(packet: RawPacket): AnyObject | null
	{
		return packet.length > 0 ? typeToField.get(packet[0])?.fromArray(packet) ?? null : null;
	},

	toArray(type: PacketType, object: AnyObject): RawPacket | null
	{
		return typeToField.get(type)?.toArray(object) ?? null;
	},
};
