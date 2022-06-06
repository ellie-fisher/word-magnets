import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";

import AppActions from "../app/actionCreators";
import AppView from "../app/AppView";
import MainMenuActions from "./actionCreators";
import RoomActions from "./actionCreators";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../sockets/packetManager";


const mainMenuMiddleware = store => next => action =>
{
	next (action);

	const state = store.getState ();

	switch ( action.type )
	{
		case "room/kickClient":
		{
			if ( action.payload === state.app.clientID )
			{
				store.dispatch (AppActions.setView (AppView.Message));
				store.dispatch (MainMenuActions.setMessage ("Kicked", "You were kicked from the room."));
			}

			break;
		}

		case "room/destroyRoom":
		{
			store.dispatch (MainMenuActions.setMessage ("Room Closed", action.payload));
			break;
		}

		default:
		{
			break;
		}
	}
};


export default mainMenuMiddleware;
