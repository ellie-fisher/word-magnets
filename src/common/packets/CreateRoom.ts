import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { RoomFields } from "../fields/fields";
import { AnyObject, getObjectValue } from "../util";

const { fields: roomFields } = RoomFields;

export const CreateRoom =
{
	pack(object: AnyObject): PacketBuffer
	{
		const { clientData = {}, roomData = {} } = object;

		return PacketBuffer.from(
			PacketType.CreateRoom,
			getObjectValue(clientData, "name", ""),
			getObjectValue(roomData, "timeLimit", roomFields.timeLimit.default),
			getObjectValue(roomData, "maxRounds", roomFields.maxRounds.default),
			getObjectValue(roomData, "maxPlayers", roomFields.maxPlayers.default),
		);
	},

	unpack(buffer: PacketBuffer): AnyObject
	{
		return {
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
		};
	},
};
