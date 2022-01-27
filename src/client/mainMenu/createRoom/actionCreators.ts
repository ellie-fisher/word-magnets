const CreateRoomActions =
{
	setField ( type: string, key: string, value: any )
	{
		return {
			type: "createRoom/setField",
			payload: { type, key, value },
		};
	},

	createRoom ()
	{
		return { type: "createRoom/createRoom" };
	},
};


export default CreateRoomActions;
