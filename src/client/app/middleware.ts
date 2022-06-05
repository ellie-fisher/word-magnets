import AppView from "./AppView";


const appMiddleware = store => next => action =>
{
	next (action);

	// if ( store.getState ().app.view === AppView.Room )
	// {
	// 	window.onbeforeunload = () => "Are you sure you want to leave?";
	// }
	// else
	// {
	// 	window.onbeforeunload = null;
	// }
};


export default appMiddleware;
