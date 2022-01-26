import AppView from "../app/AppView";
import { Action } from "../types/redux";


interface AppState
{
	error:
	{
		header: string;
		message: string;
	},

	view: AppView;
};

const initialState =
{
	error:
	{
		header: "",
		message: "",
	},

	view: AppView.Connecting,
};

const appReducer = ( state: AppState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "socket/opened":
		{
			return { ...state, view: AppView.MainMenu };
		}

		case "socket/closed":
		{
			const { code, reason } = action.payload;

			return {
				...state,

				view: AppView.Error,

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

				view: AppView.Error,

				error:
				{
					header: "Error",
					message: "An unexpected socket error has occurred.",
				},
			};
		}

		default:
		{
			return state;
		}
	}
};


export default appReducer;

export { AppState };
