import Wordbank from "../wordbanks/Wordbank";
import RoomClients from "./RoomClients";

import has from "../../common/util/has";
import wordsToString from "../../common/util/wordsToString";

import fixedWords from "../config/fixedWords";

import { SentenceWord } from "../../common/wordbanks/Sentence";
import { ValidationResult } from "../../common/validation/types";

import { MIN_SENTENCE_LEN, MAX_SENTENCE_LEN } from "../../common/rooms/constants";


class RoomWordbanks
{
	protected _wordbanks: Wordbank[];

	constructor ()
	{
		this._wordbanks =
		[
			new Wordbank ("Adjectives", "adjectives"),
			new Wordbank ("Nouns", "nouns"),
			new Wordbank ("Verbs", "verbs"),

			new Wordbank ("Grammar", fixedWords.grammar),
			new Wordbank ("Pronouns", fixedWords.pronouns),
			new Wordbank ("Miscellaneous", fixedWords.misc),
		];
	}

	selectWords ()
	{
		this._wordbanks.map (wordbank => wordbank.selectWords ());
	}

	validateSentence ( sentence: SentenceWord[], clients: RoomClients ): ValidationResult
	{
		if ( !Array.isArray (sentence) )
		{
			return [false, `Expected sentence to be an array, got \`${typeof sentence}\``];
		}

		const { length } = sentence;

		if ( length > MAX_SENTENCE_LEN )
		{
			return [false, `Sentence cannot be longer than ${MAX_SENTENCE_LEN} character(s).`];
		}

		const words = [];

		for ( let i = 0; i < length; i++ )
		{
			const sentenceWord = sentence[i];

			if ( sentenceWord.isName )
			{
				if ( !clients.hasCachedClient (sentenceWord.word as string) )
				{
					return [false, [i, "Client does not exist or was never in the room."]];
				}

				words.push (clients.getClient (sentenceWord.word as string).info.name);
			}
			else
			{
				if ( !this.isValidWordbank (sentenceWord.wordbank) )
				{
					return [false, [i, "Invalid wordbank."]];
				}

				const wordbank = this.getWordbank (sentenceWord.wordbank);

				if ( !wordbank.isValidWord (sentenceWord.word as number) )
				{
					return [false, [i, "Invalid word."]];
				}

				words.push (wordbank.getWord (sentenceWord.word as number));
			}
		}

		const sentenceString = wordsToString (words);

		if ( sentenceString.length < MIN_SENTENCE_LEN )
		{
			return [false, `Sentence must be at least ${MIN_SENTENCE_LEN} character(s).`];
		}

		if ( sentenceString.length > MAX_SENTENCE_LEN )
		{
			return [false, `Sentence cannot be longer than ${MAX_SENTENCE_LEN} character(s).`];
		}

		return [true, sentenceString];
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

export { MIN_SENTENCE_LEN, MAX_SENTENCE_LEN };
