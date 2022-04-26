import wordsToString from "../../common/util/wordsToString";
import has from "../../common/util/has";

import { AnyObject } from "../../common/util/types";
import { IWordbank } from "../types/game";
import { SentenceWord } from "../../common/wordbanks/Sentence";


const sentenceToString = ( sentence: SentenceWord[], wordbanks: IWordbank[], clients: AnyObject ): string =>
{
	return wordsToString (sentence.map (word =>
	{
		if ( word.isName )
		{
			if ( has (clients, word.word as string) )
			{
				return clients[word.word].name;
			}
		}
		else
		{
			return wordbanks[word.wordbank].words[word.word];
		}

		return "";
	}));
};


export default sentenceToString;
