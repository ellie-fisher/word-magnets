// TODO: Add "description" functionality
const roomInfoFields =
{
	name:
	{
		type: "string",
		min: 1,
		max: 32,
		defaultValue: "My Room",
		displayName: "Name",
	},

	maxClients:
	{
		type: "integer",
		min: 2,
		max: 12,
		increments: 1,
		defaultValue: 8,
		displayName: "Player Limit",
	},

	timeLimit:
	{
		type: "integer",
		min: 10,
		max: 180,
		increments: 10,
		defaultValue: 60,
		displayName: "Time Limit",
	},

	maxRounds:
	{
		type: "integer",
		min: 1,
		max: 16,
		increments: 1,
		defaultValue: 10,
		displayName: "Rounds",
	},

	// TODO: Add chat capabilities.
	// enableChat:
	// {
	// 	type: "boolean",
	// 	defaultValue: false,
	// 	displayName: "Enable chat",
	// }

	// TODO: Add toggle for using player names in sentences.
	// usePlayerNames:
	// {
	// 	type: "boolean",
	// 	defaultValue: true,
	// 	displayName: "Player names in sentences",
	// 	description: "Allow players to use player names in their sentences",
	// }

	// TODO: Add toggle for players who join after the round starts to create sentences, vote, etc.
	// lateParticipation:
	// {
	// 	type: "boolean",
	// 	defaultValue: true,
	// 	displayName: "Allow late participation",
	// 	description: "Allow players who join after the round has started to create sentences, vote, etc.",
	// }

	// TODO: Add toggle for requiring players to have created a sentence in order to vote.
	// voteRequiresSentence:
	// {
	// 	type: "boolean",
	// 	defaultValue: false,
	// 	displayName: "Require sentence to vote",
	// 	description: "Requires players to have created a sentence of their own in order to vote for other players' sentences.",
	// }
};


export default roomInfoFields;
