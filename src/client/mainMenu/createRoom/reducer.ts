import has from "../../../common/util/has";
import initializeState from "../../validation/initializeState";

import roomInfoFields, { IRoomInfoFields } from "../../../common/validation/fields/roomInfo";

import { AnyObject } from "../../../common/util/types";
import { Action } from "../../types/redux";


type CreateRoomState =
{
	roomInfo: IRoomInfoFields,
};

const initialState =
{
	roomInfo: initializeState<IRoomInfoFields> (roomInfoFields),
};

const createRoomReducer = ( state: CreateRoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "createRoom/setField":
		{
			const { key } = action.payload;

			if ( has (state.roomInfo, key) )
			{
				return {
					...state,

					roomInfo:
					{
						...state.roomInfo,

						[key]:
						{
							...state.roomInfo[key],
							value: action.payload.value,
						},
					},
				};
			}

			return state;
		}

		default:
		{
			return state;
		}
	}
};


export default createRoomReducer;

export { CreateRoomState };
