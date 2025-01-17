import { FieldSet } from "./FieldSet";
import { NumberField, StringField } from "./Field";

export interface ClientFieldsValues
{
	name: string;
};

export interface RoomFieldsValues
{
	timeLimit: number;
	maxRounds: number;
	maxPlayers: number;
};

export const ClientFields = new FieldSet(
{
	name: new StringField("Name", 1, 16),
});

export const RoomFields = new FieldSet(
{
	timeLimit: new NumberField("Time Limit", 30, 120, 60),
	maxRounds: new NumberField("Rounds", 1, 10, 5),
	maxPlayers: new NumberField("Player Limit", 2, 10, 8),
});
