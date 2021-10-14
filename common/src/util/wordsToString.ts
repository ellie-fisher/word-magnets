const wordsToString = ( words: string[] ): string =>
{
	let string = "";

	const { length } = words;

	for ( let i = 0; i < length; i++ )
	{
		let word = words[i];

		const startHyphen = word[0] === "-";
		const endHyphen = word[word.length - 1] === "-";

		if ( word === "-" )
		{
			word = "";
		}
		else if ( startHyphen || endHyphen )
		{
			word = word.substring (startHyphen as any, word.length - (endHyphen as any));
		}

		string += word;

		if ( i < length - 1 && !endHyphen && words[i + 1][0] !== "-" )
		{
			string += " ";
		}
	}

	return string;
};


export default wordsToString;
