import { combineReducers } from "redux";

import appReducer from "./app/reducer";
import mainMenuReducer from "./mainMenu/reducer";
import createRoomReducer from "./mainMenu/createRoom/reducer";
import joinRoomReducer from "./mainMenu/joinRoom/reducer";
import roomReducer from "./room/reducer";


const rootReducer = combineReducers (
{
	app: appReducer,
	mainMenu: mainMenuReducer,
	createRoom: createRoomReducer,
	joinRoom: joinRoomReducer,
	room: roomReducer,
});


export default rootReducer;
