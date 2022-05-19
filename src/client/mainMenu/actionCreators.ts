import MainMenuTab from "./MainMenuTab";


const MainMenuActions =
{
	setField ( type: string, key: string, value: any )
	{
		return {
			type: "mainMenu/setField",
			payload: { type, key, value },
		};
	},

	selectTab ( tab: MainMenuTab )
	{
		return {
			type: "mainMenu/selectTab",
			payload: tab,
		};
	},

	setMessage ( title: string, body: string )
	{
		return {
			type: "mainMenu/setMessage",
			payload: { title, body },
		};
	},
};


export default MainMenuActions;
