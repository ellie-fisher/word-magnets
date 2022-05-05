import MainMenuTab from "./MainMenuTab";

import has from "../../common/util/has";
import initializeState from "../validation/initializeState";

import roomInfoFields, { IRoomInfoFields } from "../../common/validation/fields/roomInfo";
import clientInfoFields, { IClientInfoFields } from "../../common/validation/fields/clientInfo";

import { Action } from "../types/redux";


interface MainMenuState
{
	info:
	{
		roomInfo: IRoomInfoFields;
		clientInfo: IClientInfoFields;
	};

	tab: MainMenuTab;
};

const initialState =
{
	info:
	{
		roomInfo: initializeState<IRoomInfoFields> (roomInfoFields),
		clientInfo: initializeState<IClientInfoFields> (clientInfoFields),
	},

	tab: MainMenuTab.CreateRoom,
};

const mainMenuReducer = ( state: MainMenuState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "mainMenu/setField":
		{
			const { type, key } = action.payload;

			if ( has (state.info, type) && has (state.info[type], key) )
			{
				return {
					...state,

					info:
					{
						...state.info,

						[type]:
						{
							...state.info[type],

							[key]:
							{
								...state.info[type][key],
								value: action.payload.value,
							},
						},
					},
				};
			}

			return state;
		}

		case "mainMenu/selectTab":
		{
			return {
				...state,
				tab: action.payload,
			};
		}

		default:
		{
			return state;
		}
	}
};


export default mainMenuReducer;

export { MainMenuState };
