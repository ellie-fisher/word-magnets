const clientInfoFields =
{
	name:
	{
		type: "string",
		min: 1,
		max: 24,
		repeatSpaces: false,    // Do not allow repeat spaces.
		trailingSpaces: false,  // Do not allow trailing spaces.
		displayName: "Name",
	},
};

interface IClientInfoFields
{
	name: string;
};


export default clientInfoFields;

export { IClientInfoFields };
