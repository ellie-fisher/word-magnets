import { createStore } from "redux";

import rootReducer from "./reducer";


const store = createStore (
	rootReducer,
	// @ts-ignore
	// TODO: Only enable in development mode.
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__ (),
);


export default store;
