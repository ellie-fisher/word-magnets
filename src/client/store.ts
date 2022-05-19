import { createStore, compose, applyMiddleware } from "redux";

import rootReducer from "./reducer";

import appMidleware from "./app/middleware";
import mainMenuMiddleware from "./mainMenu/middleware";
import socketMiddleware from "./sockets/middleware/socket";
import requestsMiddleware from "./sockets/middleware/requests";
import roomMiddleware from "./room/general/middleware";
import createPhaseMiddleware from "./room/create/middleware";


// TODO: Only enable devtools in development mode.
// @ts-ignore
const composeFunction = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore (
	rootReducer,
	composeFunction (applyMiddleware (
		appMidleware,
		mainMenuMiddleware,
		requestsMiddleware,
		socketMiddleware,
		roomMiddleware,
		createPhaseMiddleware,
	)),
);


export default store;
