import { isValidIndex } from "../util";

export enum SentenceConversionError
{
	None,
	Invalid,
	TooShort,
	TooLong,
};

export const Sentence = Object.freeze(
{
	MAX_LENGTH: 100,

	convertToString(words: [number, number][], wordbanks: string[][]): [SentenceConversionError, string]
	{
		let error = SentenceConversionError.None;
		let str = "";
		let prevWord = "";

		const length = Math.min(words.length, Sentence.MAX_LENGTH);
		const truncated = length !== words.length;

		for (let i = 0; i < length; i++)
		{
			const [bankIndex, wordIndex] = words[i];

			if (!isValidIndex(wordbanks, bankIndex) || !isValidIndex(wordbanks[bankIndex], wordIndex))
			{
				return [SentenceConversionError.Invalid, ""];
			}

			const word = wordbanks[bankIndex][wordIndex];
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

		str = str.trim();

		if (str.length <= 0)
		{
			error = SentenceConversionError.TooShort;
		}
		else if (str.length > Sentence.MAX_LENGTH || truncated)
		{
			error = SentenceConversionError.TooLong;
		}

		return [error, str];
	},
});
