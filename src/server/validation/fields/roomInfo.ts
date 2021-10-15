const roomInfoFields =
{
	name:
	{
		type: "string",
		min: 1,
		max: 32,
		defaultValue: "My Server",
		displayName: "Name",
	},

	password:
	{
		type: "password",
		min: 1,
		max: 12,
		defaultValue: "",
		displayName: "Password",
	},

	maxClients:
	{
		type: "integer",
		min: 1,
		max: 16,
		defaultValue: 8,
		displayName: "Player limit",
	},

	timeLimit:
	{
		type: "integer",
		min: 10,
		max: 180,
		defaultValue: 60,
		displayName: "Time limit",
	},

	maxRounds:
	{
		type: "integer",
		min: 1,
		max: 16,
		defaultValue: 10,
		displayName: "Rounds",
	},

	// TODO: Add chat capabilities
	// enableChat:
	// {
	// 	type: "boolean",
	// 	defaultValue: false,
	// 	displayName: "Enable chat",
	// }

	// TODO: Add ability to not show on server list and to join directly from an ID.
	// showOnList:
	// {
	// 	type: "boolean",
	// 	defaultValue: true,
	// 	displayName: "Show on server list",
	// }
};


export default roomInfoFields;
