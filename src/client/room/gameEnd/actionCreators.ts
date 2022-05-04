import { AnyObject } from "../../../common/util/types";


const GameEndPhaseActions =
{
	scores ( scores: AnyObject )
	{
		return {
			type: "room/gameEnd/scores",
			payload: scores,
		};
	},
};


export default GameEndPhaseActions;
