const censorString = ( str: string, regex: RegExp ): string =>
{
	return str.replace (regex, (match =>
	{
		let censored = "";
		const { length } = match

		for ( let i = 0; i < length; i++ )
		{
			censored += "*";
		}

		return censored;
	}) as any);
};

const applyFilter = ( str: string, rules: RegExp[] ): string =>
{
	let filtered = str;

	rules.forEach (regex =>
	{
		filtered = censorString (filtered, regex);
	});

	return filtered;
};


export { censorString, applyFilter };
