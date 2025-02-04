import { Packet } from "../../common/packets/Packet";
import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { PacketType } from "../../common/packets/PacketType";

export const JoinRoomRejectedPacket =
{
	pack(message: string): PacketBuffer
	{
		return Packet.pack({ type: PacketType.JoinRoomRejected, data: { message } });
	},
};
