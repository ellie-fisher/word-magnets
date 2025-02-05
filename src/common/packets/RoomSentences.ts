import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { UnpackedPacket } from "./types";
import { RoomFields } from "../fields/fields";
import { AnyObject } from "../util";
import { ClientSentence } from "../words/Sentence";

export interface UnpackedRoomSentences extends UnpackedPacket
{
	data: ClientSentence[];
};

export const RoomSentences =
{
	pack(unpacked: UnpackedRoomSentences): PacketBuffer
	{
		return PacketBuffer.from(
			PacketType.RoomSentences,
			...(unpacked.data ?? []).flatMap(sentence => [sentence.id, sentence.sentence, sentence.votes]),
		);
	},

	unpack(buffer: PacketBuffer): UnpackedPacket
	{
		const unpacked: UnpackedPacket = { type: buffer.readU8(), data: {} };
		const { max } = RoomFields.fields.maxPlayers;

		for (let i = 0; i < max && !buffer.isAtEnd; i++)
		{
			(unpacked.data as AnyObject)[buffer.readString()] =
			{
				sentence: buffer.readString(),
				votes: buffer.readU8(),
			};
		}

		return unpacked;
	},
};
