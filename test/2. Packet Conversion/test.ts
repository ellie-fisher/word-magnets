import { deepStrictEqual, equal } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
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

			defaultValues:
			{
				clientData: { name: "" },
				roomData:
				{
					timeLimit: roomFields.timeLimit.default,
					maxRounds: roomFields.maxRounds.default,
					maxPlayers: roomFields.maxPlayers.default,
				},
			},
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
			template: { words: [[0, 1], [1, 6], [3, 16], [2, 14], [3, 7]] },
			defaultValues: null,
			test: function()
			{
				/* Check for invalid flattened sentence array. */

				const packet = Packet.fromArray([PacketType.SubmitSentence, 0, 1, 1, 6, 3, 16, 2, 14, 3]);

				equal(Object.hasOwn(packet, "words"), true);
				equal(Array.isArray(packet.words), true);
				deepStrictEqual(packet, { words: [] });
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
});
