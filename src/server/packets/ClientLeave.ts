import { Packet } from "../../common/packets/Packet";
import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { PacketType } from "../../common/packets/PacketType";
import { Client } from "../Client";

export const ClientLeavePacket =
{
	pack(client: Client): PacketBuffer
	{
		return Packet.pack({ type: PacketType.ClientLeave, data: { id: client.id } });
	},
};
