import Sentence from "../../../common/wordbanks/Sentence";

import { Action } from "../../types/redux";
import { AnyObject } from "../../../common/util/types";


interface GameEndState
{
	scores: AnyObject[];
};

const initialState =
{
	scores: [],
};

const gameEndReducer = ( state: GameEndState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "room/newRound":
		{
			return { ...initialState };
		}

		case "room/gameEnd/scores":
		{
			return {
				...state,
				scores: action.payload,
			};
		}
	}

	return state;
};


export default gameEndReducer;
