import { AnyObject } from "../../../common/util/types";
import { SentenceWord } from "../../../common/wordbanks/Sentence";


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

	destroyRoom ( reason: string )
	{
		return {
			type: "room/destroyRoom",
			payload: reason,
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

	leaveRoom ()
	{
		return { type: "room/leaveRoom" };
	},

	startGame ()
	{
		return { type: "room/startGame" };
	},

	kickClient ( clientID: string )
	{
		return {
			type: "room/kickClient",
			payload: clientID,
		};
	},

	kickClientRequest ( clientID: string )
	{
		return {
			type: "room/kickClient:request",
			payload: clientID,
		};
	},

	kickClientResponse ( data: any )
	{
		return {
			type: "room/kickClient:response",
			payload: data,
		};
	},
};


export default RoomActions;
