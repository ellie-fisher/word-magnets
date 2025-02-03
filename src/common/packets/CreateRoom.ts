import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { RoomFields } from "../fields/fields";
import { UnpackedPacket } from "./types";
import { getObjectValue } from "../util";

const { fields: roomFields } = RoomFields;

export const CreateRoom =
{
	pack(unpacked: UnpackedPacket): PacketBuffer
	{
		const { clientData = {}, roomData = {} } = unpacked.data ?? {};

		return PacketBuffer.from(
			PacketType.CreateRoom,
			getObjectValue(clientData, "name", ""),
			getObjectValue(roomData, "timeLimit", roomFields.timeLimit.default),
			getObjectValue(roomData, "maxRounds", roomFields.maxRounds.default),
			getObjectValue(roomData, "maxPlayers", roomFields.maxPlayers.default),
		);
	},

	unpack(buffer: PacketBuffer): UnpackedPacket
	{
		return {
			type: buffer.readU8(),
			data:
			{
				clientData:
				{
					name: buffer.readString(),
				},

				roomData:
				{
					timeLimit: buffer.readU8(),
					maxRounds: buffer.readU8(),
					maxPlayers: buffer.readU8(),
				},
			},
		};
	},
};
