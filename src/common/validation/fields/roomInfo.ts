const roomInfoFields =
{
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
};


export default roomInfoFields;
