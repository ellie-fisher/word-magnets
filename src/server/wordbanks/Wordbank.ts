import got from "got";

import objectToURL from "../../common/util/objectToURL";
import apiRequest from "../config/api/apiRequest";
import apiKey from "../config/api/apiKey";


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

	async fetchWords ( maxRetries: number = 2, timeout: number = 5000 )
	{
		if ( this.isFixed )
		{
			return;
		}

		const url = objectToURL (apiRequest,
		{
			includePartOfSpeech: this.partsOfSpeech,
			api_key: apiKey,
		});

		const words: any[] = await got (url, { retry: maxRetries, timeout }).json ();

		this._words = words.map (data => data.word);
	}

	/**
	 * Replaces bad words with random ones in `substitutes`.
	 */
	filterWords ( substitutes: string[] )
	{
		substitutes = substitutes.slice ();
		// TODO: Filter words with to-be-created rules.
	}

	toJSON ()
	{
		return { displayName: this.displayName, words: this._words.slice () };
	}

	get isFixed ()
	{
		return this.partsOfSpeech.length <= 0;
	}
}


export default Wordbank;
