import MainMenuTab from "./MainMenuTab";

import has from "../../common/util/has";
import initializeState from "../validation/initializeState";

import roomInfoFields, { IRoomInfoFields } from "../../common/validation/fields/roomInfo";
import clientInfoFields, { IClientInfoFields } from "../../common/validation/fields/clientInfo";

import { Action } from "../types/redux";


interface MainMenuState
{
	roomInfo: IRoomInfoFields,
	clientInfo: IClientInfoFields,
	tab: MainMenuTab;
};

const initialState =
{
	roomInfo: initializeState<IRoomInfoFields> (roomInfoFields),
	clientInfo: initializeState<IClientInfoFields> (clientInfoFields),
	tab: MainMenuTab.CreateRoom,
};

const mainMenuReducer = ( state: MainMenuState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "mainMenu/setField":
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
