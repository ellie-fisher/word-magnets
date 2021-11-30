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

		// Add a space if the current word is not the last, if it does not end with a hyphen, and
		// if the next word does not start with a hyphen.
		if ( i < length - 1 && !endHyphen && words[i + 1][0] !== "-" )
		{
			string += " ";
		}
	}

	// TODO: Add a censor/sanitizer function
	return string.replace (/[\x00-\x1F\x7F]/g, "");
};


export default wordsToString;
