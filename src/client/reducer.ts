import { combineReducers } from "redux";

import appReducer from "./app/reducer";
import createRoomReducer from "./mainMenu/reducers/createRoom";


const rootReducer = combineReducers (
{
	app: appReducer,
	createRoom: createRoomReducer,
});


export default rootReducer;
