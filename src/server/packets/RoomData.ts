import { Packet } from "../../common/packets/Packet";
import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { PacketType } from "../../common/packets/PacketType";
import { RoomData } from "../rooms/RoomData";

export const RoomDataPacket =
{
	pack(data: RoomData): PacketBuffer
	{
		return Packet.pack({ type: PacketType.RoomData, data });
	},
};
