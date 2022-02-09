import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import roomInfoFields from "../../common/validation/fields/roomInfo";

import initializeState from "../validation/initializeState";

import { Action } from "../types/redux";
import { AnyObject } from "../../common/util/types";


interface RoomState
{
	phase: RoomPhaseType;
	clients: AnyObject;
	info: AnyObject;
};

const initialState =
{
	phase: RoomPhaseType.Lobby,
	clients: {},
	info: {},
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

		case "room/clientLeaveRoom":
		{
			const clients = { ...state.clients };

			delete clients[action.payload];

			return { ...state, clients };
		}

		case "room/roomInfo":
		{
			return {
				...state,

				info:
				{
					...state.info,
					...action.payload,
				},
			};
		}
	}

	return state;
};


export default RoomReducer;

export { RoomState };
