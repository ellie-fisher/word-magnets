import { PacketType } from "../../src/common/packets/PacketType";
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
});
