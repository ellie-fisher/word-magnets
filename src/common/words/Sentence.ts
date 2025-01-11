import { isValidIndex } from "../util.js";
import { Wordbank } from "./Wordbank.js";

export const Sentence =
{
	toString(words: [number, number], wordbanks: Wordbank[]): string | null
	{
		let str = "";

		const { length } = words;

		for (let i = 0; i < length; i++)
		{
			// We have to do this dumb bullshit because TypeScript is a broken language.
			const [bankIndex, wordIndex] = words[i] as unknown as number[];

			if (!isValidIndex(wordbanks, bankIndex) || !wordbanks[bankIndex].has(wordIndex))
			{
				return null;
			}

			str += wordbanks[bankIndex].words[wordIndex];
		}

		return str;
	},
};
