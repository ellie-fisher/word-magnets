import ResultsPhaseModel from "./ResultsPhaseModel";

import RoomController from "../RoomController";
import RoomModel from "../RoomModel";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";


const ResultsPhaseController =
{
	setResults ( data )
	{
		ResultsPhaseModel.scores = data.scores;
		ResultsPhaseModel.nameCache = data.nameCache;
	},

	clearResults ()
	{
		ResultsPhaseModel.scores = {};
		ResultsPhaseModel.nameCache = {};
	},
};


export default ResultsPhaseController;
