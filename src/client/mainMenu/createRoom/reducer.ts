import has from "../../../common/util/has";
import initializeState from "../../validation/initializeState";

import roomInfoFields, { IRoomInfoFields } from "../../../common/validation/fields/roomInfo";
import clientInfoFields, { IClientInfoFields } from "../../../common/validation/fields/clientInfo";

import { Action } from "../../types/redux";


type CreateRoomState =
{
	roomInfo: IRoomInfoFields,
	clientInfo: IClientInfoFields,
	error: any;
};

const initialState =
{
	roomInfo: initializeState<IRoomInfoFields> (roomInfoFields),
	clientInfo: initializeState<IClientInfoFields> (clientInfoFields),
	error: "",
};

const createRoomReducer = ( state: CreateRoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "createRoom/setField":
		{
			const { type, key } = action.payload;

			if ( has (state, type) && has (state[type], key) )
			{
				return {
					...state,

					[type]:
					{
						...state[type],

						[key]:
						{
							...state[type][key],
							value: action.payload.value,
						},
					},
				};
			}

			return state;
		}

		case "createRoom/createRoom:response":
		{
			if ( action.payload.ok )
			{
				return state;
			}

			return { ...state, error: action.payload.data };
		}

		default:
		{
			return state;
		}
	}
};


export default createRoomReducer;

export { CreateRoomState };
