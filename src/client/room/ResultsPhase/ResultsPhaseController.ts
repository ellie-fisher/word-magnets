import ResultsPhaseModel from "./ResultsPhaseModel";

import RoomController from "../RoomController";
import RoomModel from "../RoomModel";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";


const ResultsPhaseController =
{
	setSentenceScores ( scores )
	{
		ResultsPhaseModel.sentenceScores = scores;
	},

	clearSentenceScores ()
	{
		ResultsPhaseModel.sentenceScores = {};
	}
};


export default ResultsPhaseController;
