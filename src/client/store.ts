import { createStore, compose, applyMiddleware } from "redux";

import rootReducer from "./reducer";
import packetMiddleware from "./sockets/middleware";


// TODO: Only enable devtools in development mode.
// @ts-ignore
const composeFunction = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore (
	rootReducer,
	composeFunction (applyMiddleware (packetMiddleware)),
);


export default store;
