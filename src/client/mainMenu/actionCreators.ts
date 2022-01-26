import MainMenuTab from "./MainMenuTab";


const MainMenuActions =
{
	selectTab ( tab: MainMenuTab )
	{
		return {
			type: "mainMenu/selectTab",
			payload: tab,
		};
	},
};


export default MainMenuActions;
