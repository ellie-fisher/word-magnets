const clientInfoFields =
{
	name:
	{
		type: "string",
		min: 1,
		max: 24,
		repeatSpaces: false,    // Do not allow repeat spaces.
		trailingSpaces: false,  // Do not allow trailing spaces.
	},
};


export default clientInfoFields;
