import Sentence from "../../../common/wordbanks/Sentence";

import { Action } from "../../types/redux";
import { AnyObject } from "../../../common/util/types";


interface ResultsPhaseState
{
	sentences: AnyObject;
};

const initialState =
{
	sentences:
	{
		sentences: {},
		nameCache: {},
	},
};

const resultsPhaseReducer = ( state: ResultsPhaseState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "room/newRound":
		{
			return { ...initialState };
		}

		case "room/results/sentences":
		{
			return {
				...state,
				sentences:
				{
					sentences: action.payload.sentences || {},
					nameCache: action.payload.nameCache || {},
				}
			};
		}
	}

	return state;
};


export default resultsPhaseReducer;
