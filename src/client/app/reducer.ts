import AppView from "../app/AppView";
import { Action } from "../types/redux";


const initialState =
{
	view: AppView.Connecting,
};

const appReducer = ( state: any = initialState, action: Action ) =>
{
	return state;
};


export default appReducer;
