import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";

import { Action } from "../types/redux";
import { AnyObject } from "../../common/util/types";


interface RoomState
{
	phase: RoomPhaseType;
	clients: AnyObject;
};

const initialState =
{
	phase: RoomPhaseType.Lobby,
	clients: {},
};

const RoomReducer = ( state: RoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "room/clientJoinRoom":
		{
			return {
				...state,

				clients:
				{
					...state.clients,
					[action.payload.id]: { ...action.payload },
				},
			};
		}
	}

	return state;
};


export default RoomReducer;

export { RoomState };
