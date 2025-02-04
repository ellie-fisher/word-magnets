import { Packet } from "../../common/packets/Packet";
import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { PacketType } from "../../common/packets/PacketType";
import { Client } from "../Client";

export const ClientJoinPacket =
{
	pack(client: Client): PacketBuffer
	{
		return Packet.pack({ type: PacketType.ClientJoin, data: { id: client.id } });
	},
};
