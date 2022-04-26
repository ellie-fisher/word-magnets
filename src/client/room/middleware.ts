import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";

import AppActions from "../app/actionCreators";
import AppView from "../app/AppView";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../sockets/packetManager";


const roomMiddleware = store => next => action =>
{
	next (action);

	const state = store.getState ();

	switch ( action.type )
	{
		case "room/clientJoinRoom":
		{
			if ( action.payload.id === state.app.clientID )
			{
				store.dispatch (AppActions.setView (AppView.Room));
			}

			break;
		}

		case "room/leaveRoom":
		{
			packetManager.sendDataPacket (PacketCommand.LeaveRoom);
			store.dispatch (AppActions.setView (AppView.MainMenu));

			break;
		}

		case "room/startGame":
		{
			packetManager.sendRequestPacket (PacketCommand.StartGame);
			break;
		}

		case "room/phaseData":
		{
			const { payload } = action;

			if ( payload.type === RoomPhaseType.Create && payload.state === RoomPhaseState.End )
			{
				packetManager.sendRequestPacket (PacketCommand.SendSentence, state.room.sentence);
			}

			break;
		}

		default:
		{
			break;
		}
	}
};


export default roomMiddleware;
