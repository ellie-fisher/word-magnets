import has from "../../../common/util/has";
import initializeState from "../../validation/initializeState";

import clientInfoFields, { IClientInfoFields } from "../../../common/validation/fields/clientInfo";

import { Action } from "../../types/redux";


interface JoinRoomState
{
	clientInfo: IClientInfoFields,
	error: string;
};

const initialState =
{
	clientInfo: initializeState<IClientInfoFields> (clientInfoFields),
	error: "",
};

const joinRoomReducer = ( state: JoinRoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		// TODO: Get rid of repeat code regarding fields for `joinRoom` and `createRoom`
		case "joinRoom/setField":
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

		case "joinRoom/joinRoom:response":
		{
			if ( action.payload.ok )
			{
				return state;
			}

			return { ...state, error: action.payload.data };
		}

		case "joinRoom/clearError":
		{
			return { ...state, error: "" };
		}
	}

	return state;
};


export default joinRoomReducer;

export { JoinRoomState };
