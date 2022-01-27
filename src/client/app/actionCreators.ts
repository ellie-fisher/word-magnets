import AppView from "./AppView";


const AppActions =
{
	setView ( view: AppView )
	{
		return { type: "app/setView", payload: view };
	},

	socketOpened ()
	{
		return { type: "socket/opened" };
	},

	socketClosed ( code: number, reason: string = "" )
	{
		return {
			type: "socket/closed",
			payload: { code, reason },
		};
	},

	socketError ()
	{
		return { type: "socket/error" };
	},
};


export default AppActions;
