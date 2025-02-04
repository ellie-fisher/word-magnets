import { Packet } from "../../common/packets/Packet";
import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { PacketType } from "../../common/packets/PacketType";
import { Client } from "../Client";

export const ClientIDPacket =
{
	pack(client: Client): PacketBuffer
	{
		return Packet.pack({ type: PacketType.ClientID, data: { id: client.id } });
	},
};
