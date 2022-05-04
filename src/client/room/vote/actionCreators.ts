import { AnyObject } from "../../../common/util/types";


const VotePhaseActions =
{
	sentences ( sentences: AnyObject )
	{
		return {
			type: "room/voting/sentences",
			payload: sentences,
		};
	},

	setVote ( voteID: number )
	{
		return {
			type: "room/voting/setVote",
			payload: voteID,
		};
	},
};


export default VotePhaseActions;
