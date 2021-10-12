class Wordbank
{
	public displayName: string;
	public partsOfSpeech: string[];
	protected _words: string[];

	constructor ( displayName: string, partsOfSpeech: string[], words: string[] = [] )
	{
		this.displayName = displayName;
		this.partsOfSpeech = partsOfSpeech;
		this._words = words;
	}

	setWords ( words: string[] )
	{
		this._words = words;
	}

	getWord ( index: number ): string
	{
		return this.isValidWord (index) ? this._words[index] : "";
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

	get isFixed ()
	{
		return this.partsOfSpeech.length <= 0;
	}
}


export default Wordbank;
