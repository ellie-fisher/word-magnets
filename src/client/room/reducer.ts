import { combineReducers } from "redux";

import generalReducer from "./general/reducer";
import createPhaseReducer from "./create/reducer";
import votePhaseReducer from "./vote/reducer";
import resultsPhaseReducer from "./results/reducer";
import gameEndPhaseReducer from "./gameEnd/reducer";


const roomReducer = combineReducers (
{
	general: generalReducer,
	create: createPhaseReducer,
	vote: votePhaseReducer,
	results: resultsPhaseReducer,
	gameEnd: gameEndPhaseReducer,
});


export default roomReducer;
