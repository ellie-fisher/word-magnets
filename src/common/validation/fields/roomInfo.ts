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

	// TODO: Replace password feature with `showOnList`.
	// password:
	// {
	// 	type: "password",
	// 	min: 1,
	// 	max: 12,
	// 	defaultValue: "",
	// 	displayName: "Password",
	// },

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

	// TODO: Add ability to not show on room list and to join directly from an ID.
	//       This should replace passwords because it serves the same purpose as passwords without
	//       clogging up the room list.
	//
	// showOnList:
	// {
	// 	type: "boolean",
	// 	defaultValue: true,
	// 	displayName: "Show on room list",
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
