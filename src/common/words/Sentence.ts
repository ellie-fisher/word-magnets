import { isValidIndex } from "../util";
import { Wordbank } from "./Wordbank";

export const Sentence = Object.freeze(
{
	MAX_LENGTH: 100,

	toString(words: [number, number][], wordbanks: Wordbank[]): string
	{
		let str = "";

		const { length } = words;

		if (length <= Sentence.MAX_LENGTH)
		{
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

				str += sliced;
				prevWord = word;
			}
		}

		str = str.trim();

		return str.length <= Sentence.MAX_LENGTH ? str : "";
	},
});
