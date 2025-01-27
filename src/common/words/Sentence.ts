import { isValidIndex } from "../util";
import { Wordbank } from "./Wordbank";

export const Sentence =
{
	toString(words: [number, number][], wordbanks: Wordbank[], maxLength: number): string
	{
		let str = "";

		const { length } = words;

		let prevWord = "";

		for (let i = 0; i < length; i++)
		{
			const [bankIndex, wordIndex] = words[i];

			if (!isValidIndex(wordbanks, bankIndex) || !wordbanks[bankIndex].hasAt(wordIndex))
			{
				return "";
			}

			const word = wordbanks[bankIndex].words[wordIndex];
			const startsWithHyphen = word.at(0) === "-";
			const skipSpace = prevWord.at(-1) === "-" || startsWithHyphen;
			const sliced = word.slice(Number(startsWithHyphen), word.length - Number(word.at(-1) === "-"));

			if (!skipSpace && word !== " ")
			{
				str += " ";
			}

			if (str.length + sliced.length > maxLength)
			{
				return "";
			}

			str += sliced;
			prevWord = word;
		}

		return str.trim();
	},
};
