const CreateRoomActions =
{
	setField ( type: string, key: string, value: any )
	{
		return {
			type: "createRoom/setField",
			payload: { type, key, value },
		};
	},

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
