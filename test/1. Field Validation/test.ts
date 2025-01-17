import { deepStrictEqual } from "node:assert";
import { ClientFields, RoomFields } from "../../src/common/fields/fields";
import { FieldValidationResult } from "../../src/common/fields/Field";

describe("Field Validation", function()
{
	describe("Client Fields", function()
	{
		it("should validate `name` field properly", function()
		{
			deepStrictEqual(ClientFields.validate({}), [FieldValidationResult.Required, "name"]);
			deepStrictEqual(ClientFields.validate({ name: 0 }), [FieldValidationResult.Type, "name"]);
			deepStrictEqual(ClientFields.validate({ name: "" }), [FieldValidationResult.Min, "name"]);
			deepStrictEqual(ClientFields.validate({ name: "asdfasdfasdfasdff" }), [FieldValidationResult.Max, "name"]);
			deepStrictEqual(ClientFields.validate({ name: "asdfasdfasdfasdf" }), [FieldValidationResult.Success]);
		});
	});

	describe("Room Fields", function()
	{
		it("should validate `timeLimit` field properly", function()
		{
			deepStrictEqual(RoomFields.validate({}), [FieldValidationResult.Success]); // Not required.
			deepStrictEqual(RoomFields.validate({ timeLimit: "60" }), [FieldValidationResult.Type, "timeLimit"]);
			deepStrictEqual(RoomFields.validate({ timeLimit: 29 }), [FieldValidationResult.Min, "timeLimit"]);
			deepStrictEqual(RoomFields.validate({ timeLimit: 121 }), [FieldValidationResult.Max, "timeLimit"]);
			deepStrictEqual(RoomFields.validate({ timeLimit: 90 }), [FieldValidationResult.Success]);
		});

		it("should validate `maxRounds` field properly", function()
		{
			deepStrictEqual(RoomFields.validate({}), [FieldValidationResult.Success]); // Not required.
			deepStrictEqual(RoomFields.validate({ maxRounds: "8" }), [FieldValidationResult.Type, "maxRounds"]);
			deepStrictEqual(RoomFields.validate({ maxRounds: 0 }), [FieldValidationResult.Min, "maxRounds"]);
			deepStrictEqual(RoomFields.validate({ maxRounds: 11 }), [FieldValidationResult.Max, "maxRounds"]);
			deepStrictEqual(RoomFields.validate({ maxRounds: 8 }), [FieldValidationResult.Success]);
		});

		it("should validate `maxPlayers` field properly", function()
		{
			deepStrictEqual(RoomFields.validate({}), [FieldValidationResult.Success]); // Not required.
			deepStrictEqual(RoomFields.validate({ maxPlayers: "10" }), [FieldValidationResult.Type, "maxPlayers"]);
			deepStrictEqual(RoomFields.validate({ maxPlayers: 1 }), [FieldValidationResult.Min, "maxPlayers"]);
			deepStrictEqual(RoomFields.validate({ maxPlayers: 11 }), [FieldValidationResult.Max, "maxPlayers"]);
			deepStrictEqual(RoomFields.validate({ maxPlayers: 10 }), [FieldValidationResult.Success]);
		});

		it("should handle default values properly", function()
		{
			const clientValues = {};
			const roomValues = {};

			deepStrictEqual(ClientFields.validate(clientValues), [FieldValidationResult.Required, "name"]);
			deepStrictEqual(RoomFields.validate(roomValues), [FieldValidationResult.Success]);
			deepStrictEqual(roomValues, { timeLimit: 60, maxRounds: 5, maxPlayers: 8 });
		});
	});
});
