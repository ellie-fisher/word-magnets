import { AnyObject } from "../../common/util/types";


const MainMenuActions =
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

	roomInfo ( info: AnyObject )
	{
		return {
			type: "room/roomInfo",
			payload: info,
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


export default MainMenuActions;
