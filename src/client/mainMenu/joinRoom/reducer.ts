import { Action } from "../../types/redux";


interface JoinRoomState
{
	error: string | string[];
};

const initialState =
{
	error: "",
};

const joinRoomReducer = ( state: JoinRoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "joinRoom/joinRoom:response":
		{
			if ( action.payload.ok )
			{
				return state;
			}

			return {
				...state,
				error: action.payload.data,
			};
		}

		case "mainMenu/selectTab":
		{
			return { ...state, error: "" };
		}

		default:
		{
			break;
		}
	}

	return state;
};


export default joinRoomReducer;

export { JoinRoomState };
