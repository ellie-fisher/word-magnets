import { deepStrictEqual, equal } from "node:assert";

import { PacketType } from "../../src/common/packets/PacketType";
import { Packet } from "../../src/common/packets/Packet";
import { RoomFields } from "../../src/common/fields/fields";
import { testConversion } from "./testConversion";

const { fields: roomFields } = RoomFields;

describe("Packet Conversion", function()
{
	testConversion("Invalid", [PacketType.Invalid], {});
	testConversion("ClientID", [PacketType.ClientID, "test-id"], { id: "test-id" });

	testConversion(
		"CreateRoom",
		[PacketType.CreateRoom, "Room Creator", 90, 8, 10],
		{
			clientData: { name: "Room Creator" },
			roomData:
			{
				timeLimit: 90,
				maxRounds: 8,
				maxPlayers: 10,
			},
		},
		{
			clientData: { name: "" },
			roomData:
			{
				timeLimit: roomFields.timeLimit.default,
				maxRounds: roomFields.maxRounds.default,
				maxPlayers: roomFields.maxPlayers.default,
			},
		},
	);

	testConversion("JoinRoom", [PacketType.JoinRoom, "room-id", "client-name"], { id: "room-id", name: "client-name" });
	testConversion("LeaveRoom", [PacketType.LeaveRoom], {});
	testConversion("DestroyRoom", [PacketType.DestroyRoom], {});
	testConversion("StartGame", [PacketType.StartGame], {});

	testConversion(
		"SubmitSentence",
		[PacketType.SubmitSentence, 0, 1, 1, 6, 3, 16, 2, 14, 3, 7],
		{ words: [[0, 1], [1, 6], [3, 16], [2, 14], [3, 7]] },
		null,
		function()
		{
			/* Check for invalid flattened sentence array. */

			const packet = Packet.fromArray([PacketType.SubmitSentence, 0, 1, 1, 6, 3, 16, 2, 14, 3]);

			equal(Object.hasOwn(packet, "words"), true);
			equal(Array.isArray(packet.words), true);
			deepStrictEqual(packet, { words: [] });
		},
	);
});
