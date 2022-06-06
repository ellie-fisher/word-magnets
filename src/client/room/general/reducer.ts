import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";

import { Action } from "../../types/redux";
import { AnyObject } from "../../../common/util/types";


interface RoomState
{
	phase:
	{
		type: RoomPhaseType;
		state: RoomPhaseState;
	};

	clients: AnyObject;
	info: AnyObject;
};

const initialState =
{
	phase:
	{
		type: RoomPhaseType.Lobby,
		state: RoomPhaseState.PreStart,
	},

	clients: {},
	info: {},
};

const roomReducer = ( state: RoomState = initialState, action: Action ) =>
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

		case "room/clientList":
		{
			const clients = {};

			action.payload.forEach (client =>
			{
				clients[client.id] = { ...client };
			})

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

		case "room/phaseData":
		{
			return {
				...state,
				phase:
				{
					type: action.payload.type,
					state: action.payload.state,
				}
			};
		}

		case "createRoom/createRoom:request":
		{
			return { ...initialState };
		}
	}

	return state;
};


export default roomReducer;
