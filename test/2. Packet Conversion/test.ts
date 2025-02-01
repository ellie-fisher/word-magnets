import { deepStrictEqual, equal } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
import { PacketBuffer } from "../../src/common/packets/PacketBuffer";
import { PacketType } from "../../src/common/packets/PacketType";
import { RoomFields } from "../../src/common/fields/fields";
import { testConversion } from "./testConversion";

const { fields: roomFields } = RoomFields;

describe("Packet Conversion", function()
{
	testConversion("Invalid", { raw: [PacketType.Invalid], template: {} });
	testConversion("ClientID", { raw: [PacketType.ClientID, "test-id"], template: { id: "test-id" } });

	testConversion(
		"CreateRoom",
		{
			raw: [PacketType.CreateRoom, "Room Creator", 90, 8, 10],
			template:
			{
				clientData: { name: "Room Creator" },
				roomData:
				{
					timeLimit: 90,
					maxRounds: 8,
					maxPlayers: 10,
				},
			},

			defaultValues: ["", roomFields.timeLimit.default, roomFields.maxRounds.default, roomFields.maxPlayers.default]
		},
	);

	testConversion("JoinRoom", { raw: [PacketType.JoinRoom, "room-id", "client-name"], template: { id: "room-id", name: "client-name" } });
	testConversion("LeaveRoom", { raw: [PacketType.LeaveRoom], template: {} });
	testConversion("DestroyRoom", { raw: [PacketType.DestroyRoom], template: {} });
	testConversion("StartGame", { raw: [PacketType.StartGame], template: {} });

	testConversion(
		"SubmitSentence",
		{
			raw: [PacketType.SubmitSentence, 0, 1, 1, 6, 3, 16, 2, 14, 3, 7],
			template: [[0, 1], [1, 6], [3, 16], [2, 14], [3, 7]],
			test: function()
			{
				/* Check for invalid flattened sentence array. */

				const packet = Packet.unpack(PacketBuffer.from(PacketType.SubmitSentence, 0, 1, 1, 6, 3, 16, 2, 14, 3));

				equal(Array.isArray(packet), true);
				deepStrictEqual(packet, []);
			},
		},
	);

	testConversion("SubmitVote", { raw: [PacketType.SubmitVote, "vote-id"], template: { id: "vote-id" } });
	testConversion("RemoveClient", { raw: [PacketType.RemoveClient, "client-id"], template: { id: "client-id" } });
	testConversion("CreateRoomRejected", { raw: [PacketType.CreateRoomRejected, "Big error"], template: { message: "Big error" } });
	testConversion("JoinRoomRejected", { raw: [PacketType.JoinRoomRejected, "Big error"], template: { message: "Big error" } });
	testConversion("ClientJoin", { raw: [PacketType.ClientJoin, "client-id"], template: { id: "client-id" } });
	testConversion("ClientLeave", { raw: [PacketType.ClientLeave, "client-id"], template: { id: "client-id" } });
	testConversion("RoomDestroyed", { raw: [PacketType.RoomDestroyed], template: {} });

	testConversion(
		"RoomData",
		{
			raw: [PacketType.RoomData, 32, 90, 2, 6, 8],
			template:
			{
				timeLeft: 32,
				timeLimit: 90,
				currentRound: 2,
				maxRounds: 6,
				maxPlayers: 8,
			},
			defaultValues:
			[
				roomFields.timeLimit.default,
				roomFields.timeLimit.default,
				1,
				roomFields.maxRounds.default,
				roomFields.maxPlayers.default,
			],
		},
	);

	testConversion(
		"RoomWords",
		{
			raw:
			[
				PacketType.RoomWords,
				3,
				"word-1-1",
				"word-1-2",
				"word-1-3",
				5,
				"word-2-1",
				"word-2-2",
				"word-2-3",
				"word-2-4",
				"word-2-5",
				1,
				"word-3-1",
			],
			template:
			[
				["word-1-1", "word-1-2", "word-1-3"],
				["word-2-1", "word-2-2", "word-2-3", "word-2-4", "word-2-5"],
				["word-3-1"],
			],
		},
	);

	testConversion(
		"RoomSentences",
		{
			raw:
			[
				PacketType.RoomSentences,
				"client-id-1", "This is a sentence.",
				"client-id-2", "This is also a sentence.",
				"client-id-3", "This is yet another sentence.",
			],
			template:
			{
				"client-id-1": "This is a sentence.",
				"client-id-2": "This is also a sentence.",
				"client-id-3": "This is yet another sentence.",
			},
		},
	);
});
