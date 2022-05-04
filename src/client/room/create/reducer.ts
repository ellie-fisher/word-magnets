import sentenceToString from "../../util/sentenceToString";

import Sentence, { SentenceWord } from "../../../common/wordbanks/Sentence";

import { Action } from "../../types/redux";
import { IWordbank } from "../../types/game";

import { MAX_SENTENCE_LEN } from "../../../common/rooms/constants";


interface CreatePhaseState
{
	wordbanks: IWordbank[];
	sentence: SentenceWord[];
};

const initialState =
{
	wordbanks: [],
	sentence: [],
};

const createPhaseReducer = ( state: CreatePhaseState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "room/newRound":
		{
			return { ...initialState };
		}

		case "room/create/wordbanks":
		{
			return {
				...state,
				wordbanks: action.payload,
			};
		}

		case "room/create/addWord":
		{
			const { sentence, wordbanks } = state;
			const { word, clients } = action.payload;

			const sentenceCopy = sentence.slice ();

			sentenceCopy.push (word);

			if ( sentenceToString (sentenceCopy, wordbanks, clients).length > MAX_SENTENCE_LEN )
			{
				return state;
			}

			return {
				...state,
				sentence: sentenceCopy,
			};
		}
	}

	return state;
};


export default createPhaseReducer;
