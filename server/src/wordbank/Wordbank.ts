class Wordbank
{
	public displayName: string;
	protected _words: string[];

	constructor ( displayName: string, words: string[] )
	{
		this.displayName = displayName;
		this._words = words;
	}

	isValidWord ( index: number ): boolean
	{
		return Number.isInteger (index) && index >= 0 && index < this._words.length;
	}

	/**
	 * Replaces bad words with random ones in `substitutes`.
	 */
	filterWords ( substitutes: string[] )
	{
		substitutes = substitutes.slice ();
		// TODO: Filter words with to-be-created rules.
	}
}


export default Wordbank;
