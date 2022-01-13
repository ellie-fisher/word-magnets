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

const applyFilter = ( str: string, rules: string[] ): string =>
{
	let filtered = str;

	rules.forEach (regexStr =>
	{
		filtered = censorString (filtered, new RegExp (regexStr, "gi"));
	});

	return filtered;
};

const checkFilter = ( str: string, rules: string[] ): boolean =>
{
	return rules.some (regexStr => new RegExp (regexStr, "gi").test (str));
};


export { censorString, applyFilter, checkFilter };
