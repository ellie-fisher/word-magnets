import { PacketType } from "../../src/common/packets/PacketType";
import { RoomFields } from "../../src/common/fields/fields";
import { validate } from "./validate";

const { fields: roomFields } = RoomFields;

describe("Packet Validation", function()
{
	validate("Invalid", [PacketType.Invalid], {});
	validate("ClientID", [PacketType.ClientID, "test-id"], { id: "test-id" });

	validate(
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
});
