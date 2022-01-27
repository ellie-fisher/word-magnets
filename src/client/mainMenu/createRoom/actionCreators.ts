const CreateRoomActions =
{
	setField ( type: string, key: string, value: any )
	{
		return {
			type: "createRoom/setField",
			payload: { type, key, value },
		};
	},
};


export default CreateRoomActions;
