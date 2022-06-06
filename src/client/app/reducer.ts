import AppView from "../app/AppView";
import AppActions from "../app/actionCreators";

import { Action } from "../types/redux";


interface AppState
{
	error:
	{
		header: string;
		message: string;
	},

	clientID: string;
	view: AppView;
};

const initialState =
{
	error:
	{
		header: "",
		message: "",
	},

	clientID: "",
	view: AppView.Connecting,
};

const appReducer = ( state: AppState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "app/setView":
		{
			return {
				...state,
				view: action.payload,
			};
		}

		case "room/clientJoinRoom":
		{
			if ( action.payload.id === state.clientID )
			{
				return {
					...state,
					view: AppView.Room,
				};
			}

			break;
		}

		case "room/leaveRoom":
		{
			return {
				...state,
				view: AppView.MainMenu,
			};
		}

		case "room/destroyRoom":
		{
			return {
				...state,
				view: AppView.Message,
			};
		}

		case "socket/closed":
		{
			const { code, reason } = action.payload;

			return {
				...state,

				error:
				{
					header: "Connection Closed",
					message: reason === ""
						? `The connection to the main server closed. (Code: ${code})`
						: reason,
				},
			};
		}

		case "socket/error":
		{
			return {
				...state,

				error:
				{
					header: "Error",
					message: "An unexpected socket error has occurred.",
				},
			};
		}

		case "app/clientID":
		{
			return {
				...state,
				clientID: action.payload,
			};
		}

		default:
		{
			break;
		}
	}

	return state;
};


export default appReducer;

export { AppState };
