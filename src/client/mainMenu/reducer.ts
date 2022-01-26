import MainMenuTab from "./MainMenuTab";

import { Action } from "../types/redux";


interface MainMenuState
{
	tab: MainMenuTab;
};

const initialState =
{
	tab: MainMenuTab.CreateRoom,
};

const mainMenuReducer = ( state: MainMenuState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "mainMenu/selectTab":
		{
			return { ...state, tab: action.payload };
		}

		default:
		{
			return state;
		}
	}
};


export default mainMenuReducer;

export { MainMenuState };
