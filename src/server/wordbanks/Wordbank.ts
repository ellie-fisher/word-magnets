import has from "../../common/util/has";
import wordSelection from "../config/wordSelection";


class Wordbank
{
	public displayName: string;
	public wordbank: string;
	protected _words: string[];

	constructor ( displayName: string, wordbankOrWords: string | string[] )
	{
		const isFixed = Array.isArray (wordbankOrWords);

		if ( !isFixed && !has (wordSelection.wordbanks, wordbankOrWords) )
		{
			throw new Error (`Invalid wordbank \`${wordbankOrWords}\``);
		}

		this.displayName = displayName;
		this.wordbank = isFixed ? "" : wordbankOrWords;
		this._words = isFixed ? wordbankOrWords : [];
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

	selectWords ()
	{
		if ( this.isFixed )
		{
			return;
		}

		const { numWords, maxRetries, wordbanks } = wordSelection;
		const words = wordbanks[this.wordbank];

		const selected = {};

		let wordNum = 0;
		let retry = 0;

		while ( wordNum < numWords )
		{
			const word = words[Math.floor (Math.random () * words.length)];

			if ( has (selected, word) )
			{
				if ( retry >= maxRetries )
				{
					throw new Error (
						`Failed to get a unique \`${this.wordbank}\` word after ${retry} ${
							retry === 1 ? "retry" : "retries"}.`
					);
				}

				retry++;
			}
			else
			{
				wordNum++;
				retry = 0;
				selected[word] = true;
			}
		}

		this._words = Object.keys (selected);
	}

	toJSON ()
	{
		return { displayName: this.displayName, words: this._words.slice () };
	}

	get isFixed ()
	{
		return this.wordbank === "";
	}
}


export default Wordbank;
