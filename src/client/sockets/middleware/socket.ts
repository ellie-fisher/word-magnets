import AppActions from "../../app/actionCreators";
import AppView from "../../app/AppView";


const socketMiddleware = store => next => action =>
{
	next (action);

	const state = store.getState ();

	switch ( action.type )
	{
		case "socket/opened":
		{
			store.dispatch (AppActions.setView (AppView.MainMenu));
			break;
		}

		case "socket/closed":
		{
			store.dispatch (AppActions.setView (AppView.Error));
			break;
		}

		default:
		{
			break;
		}
	}
};


export default socketMiddleware;
