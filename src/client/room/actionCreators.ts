import { AnyObject } from "../../common/util/types";
import { SentenceWord } from "../../common/wordbanks/Sentence";


const RoomActions =
{
	clientJoinRoom ( id: string )
	{
		return {
			type: "room/clientJoinRoom",
			payload: id,
		};
	},

	clientLeaveRoom ( id: string )
	{
		return {
			type: "room/clientLeaveRoom",
			payload: id,
		};
	},

	clientList ( list: AnyObject[] )
	{
		return {
			type: "room/clientList",
			payload: list,
		};
	},

	roomInfo ( info: AnyObject )
	{
		return {
			type: "room/roomInfo",
			payload: info,
		};
	},

	phaseData ( data: AnyObject )
	{
		return {
			type: "room/phaseData",
			payload: data,
		};
	},

	newRound ()
	{
		return { type: "room/newRound" };
	},

	wordbanks ( wordbanks: AnyObject )
	{
		return {
			type: "room/sentence/wordbanks",
			payload: wordbanks,
		};
	},

	addWord ( word: SentenceWord )
	{
		return {
			type: "room/sentence/addWord",
			payload: word,
		};
	},

	sentenceList ( list: AnyObject )
	{
		return {
			type: "room/voting/sentenceList",
			payload: list,
		};
	},

	setVote ( voteID: number )
	{
		return {
			type: "room/voting/setVote",
			payload: voteID,
		};
	},

	sentenceScores ( scores: AnyObject )
	{
		return {
			type: "room/results/sentenceScores",
			payload: scores,
		};
	},

	finalScores ( scores: AnyObject )
	{
		return {
			type: "room/gameEnd/finalScores",
			payload: scores,
		};
	},

	leaveRoom ()
	{
		return { type: "room/leaveRoom" };
	},

	startGame ()
	{
		return { type: "room/startGame" };
	},
};


export default RoomActions;
