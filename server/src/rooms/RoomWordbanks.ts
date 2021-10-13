import Wordbank from "../wordbanks/Wordbank";

import fixedWords from "../config/fixedWords";


class RoomWordbanks
{
	protected _wordbanks: Wordbank[];

	constructor ()
	{
		this._wordbanks =
		[
			new Wordbank ("Adjectives", ["adjective"]),
			new Wordbank ("Nouns", ["noun"]),
			new Wordbank ("Verbs", ["verb"]),

			new Wordbank ("Grammar", [], fixedWords.grammar),
			new Wordbank ("Pronouns", [], fixedWords.pronouns),
			new Wordbank ("Miscellaneous", [], fixedWords.misc),
		];
	}

	async fetchWords ( maxRetries: number = 2, timeout: number = 5000 )
	{
		await Promise.all (this._wordbanks.map (wordbank => wordbank.fetchWords (maxRetries, timeout)));
	}

	getWordbank ( index: number ): Wordbank | null
	{
		return this.isValidWordbank (index) ? this._wordbanks[index] : null;
	}

	isValidWordbank ( index: number ): boolean
	{
		return Number.isInteger (index) && index >= 0 && index < this._wordbanks.length;
	}

	toJSON ()
	{
		return this._wordbanks.map (wordbank => wordbank.toJSON ());
	}
}


export default RoomWordbanks;
