import VotePhaseModel from "./VotePhaseModel";

import RoomController from "../RoomController";
import RoomModel from "../RoomModel";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";


const VotePhaseController =
{
	setSentenceList ( list: any[] )
	{
		VotePhaseModel.sentenceList = list;
	},

	setVote ( vote: number )
	{
		if ( VotePhaseModel.sentenceList.some (sentenceData => sentenceData.voteID === vote) )
		{
			VotePhaseModel.vote = vote;
		}
	},

	clearSentenceList ()
	{
		VotePhaseModel.sentenceList = [];
		VotePhaseModel.vote = -1;
	}
};


export default VotePhaseController;
