import { Packet } from "../../common/packets/Packet";
import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { PacketType } from "../../common/packets/PacketType";

export const RoomDestroyedPacket =
{
	pack(): PacketBuffer
	{
		return Packet.pack({ type: PacketType.RoomDestroyed });
	},
};
