import { combineReducers } from "redux";

import appReducer from "./app/reducer";
import mainMenuReducer from "./mainMenu/reducer";
import createRoomReducer from "./mainMenu/createRoom/reducer";
import joinRoomReducer from "./mainMenu/joinRoom/reducer";


const rootReducer = combineReducers (
{
	app: appReducer,
	mainMenu: mainMenuReducer,
	createRoom: createRoomReducer,
	joinRoom: joinRoomReducer,
});


export default rootReducer;
