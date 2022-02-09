const MainMenuActions =
{
	clientJoinRoom ( id: string )
	{
		return {
			type: "room/clientJoinRoom",
			payload: id,
		};
	},
};


export default MainMenuActions;
