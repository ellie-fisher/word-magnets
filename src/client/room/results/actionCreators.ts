import { AnyObject } from "../../../common/util/types";


const ResultsPhaseActions =
{
	sentences ( sentences: AnyObject )
	{
		return {
			type: "room/results/sentences",
			payload: sentences,
		};
	},
};


export default ResultsPhaseActions;
