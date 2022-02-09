import { createStore, compose, applyMiddleware } from "redux";

import rootReducer from "./reducer";

import socketMiddleware from "./sockets/middleware/socket";
import requestsMiddleware from "./sockets/middleware/requests";
import roomMiddleware from "./room/middleware";


// TODO: Only enable devtools in development mode.
// @ts-ignore
const composeFunction = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore (
	rootReducer,
	composeFunction (applyMiddleware (requestsMiddleware, socketMiddleware, roomMiddleware)),
);


export default store;
