import { Action } from "../../types/redux";


type CreateRoomState =
{
	error: any;
};

const initialState =
{
	error: "",
};

const createRoomReducer = ( state: CreateRoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "createRoom/createRoom:response":
		{
			if ( action.payload.ok )
			{
				return state;
			}

			return { ...state, error: action.payload.data };
		}

		case "mainMenu/selectTab":
		{
			return { ...state, error: "" };
		}

		default:
		{
			return state;
		}
	}
};


export default createRoomReducer;

export { CreateRoomState };
