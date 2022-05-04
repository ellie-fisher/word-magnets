import { AnyObject } from "../../../common/util/types";


const JoinRoomActions =
{
	joinRoomRequest ( roomID: string )
	{
		return {
			type: "joinRoom/joinRoom:request",
			payload: roomID,
		};
	},

	joinRoomResponse ( data: any )
	{
		return {
			type: "joinRoom/joinRoom:response",
			payload: data,
		};
	},
};


export default JoinRoomActions;
