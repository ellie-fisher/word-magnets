const CreateRoomActions =
{
	createRoomRequest ()
	{
		return { type: "createRoom/createRoom:request" };
	},

	createRoomResponse ( data: any )
	{
		return {
			type: "createRoom/createRoom:response",
			payload: data,
		};
	},
};


export default CreateRoomActions;
