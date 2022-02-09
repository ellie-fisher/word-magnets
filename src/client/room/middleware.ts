import AppActions from "../app/actionCreators";
import AppView from "../app/AppView";


const roomMiddleware = store => next => action =>
{
	next (action);

	const state = store.getState ();

	switch ( action.type )
	{
		case "room/clientJoinRoom":
		{
			if ( action.payload.id === state.app.clientID )
			{
				store.dispatch (AppActions.setView (AppView.Room));
			}

			break;
		}

		default:
		{
			break;
		}
	}
};


export default roomMiddleware;
