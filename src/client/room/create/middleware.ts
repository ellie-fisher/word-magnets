import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";

import AppActions from "../../app/actionCreators";
import AppView from "../../app/AppView";
import RoomActions from "./actionCreators";

import sentenceToString from "../../util/sentenceToString";


const createPhaseMiddleware = store => next => action =>
{
	const state = store.getState ();

	switch ( action.type )
	{
		case "room/create/addWord":
		{
			// This is gross but oh well
			action.payload.clients = state.room.general.clients;
			break;
		}

		default:
		{
			break;
		}
	}

	next (action);
};


export default createPhaseMiddleware;
