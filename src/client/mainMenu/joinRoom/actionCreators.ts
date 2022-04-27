import { AnyObject } from "../../../common/util/types";


const JoinRoomActions =
{
	setField ( type: string, key: string, value: any )
	{
		return {
			type: "joinRoom/setField",
			payload: { type, key, value },
		};
	},

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
