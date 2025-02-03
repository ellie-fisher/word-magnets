import { UnpackedPacket } from './../../common/packets/types';
import { Client } from "../Client";
import { Packet } from "../../common/packets/Packet";

export const ServerPacket =
{
	...Packet,

	send(client: Client, packet: UnpackedPacket): void
	{
		const buffer = ServerPacket.pack(packet);

		if (buffer !== null)
		{
			client.send(buffer);
		}
	},
};
