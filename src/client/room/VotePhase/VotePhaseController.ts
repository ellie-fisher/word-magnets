import VotePhaseModel from "./VotePhaseModel";

import RoomController from "../RoomController";
import RoomModel from "../RoomModel";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import wordsToString from "../../../common/util/wordsToString";

import { SentenceWord } from "../../../common/wordbanks/Sentence";

import { MAX_SENTENCE_LEN } from "../../../common/rooms/constants";


const VotePhaseController =
{
	setSentenceList ( list: any[][] )
	{
		VotePhaseModel.sentenceList = list;
	},
};


export default VotePhaseController;
