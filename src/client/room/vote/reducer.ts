import Sentence from "../../../common/wordbanks/Sentence";

import { Action } from "../../types/redux";


interface VotePhaseState
{
	sentences: Sentence[];
	voteID: string;
};

const initialState =
{
	sentences: [],
	voteID: "",
};

const votePhaseReducer = ( state: VotePhaseState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "room/newRound":
		{
			return { ...initialState };
		}

		case "room/voting/sentences":
		{
			return {
				...state,
				sentences: action.payload.slice (),
			};
		}

		case "room/voting/setVote":
		{
			return {
				...state,
				voteID: action.payload,
			};
		}
	}

	return state;
};


export default votePhaseReducer;
