const CreateRoomActions =
{
	setField ( key: string, value: any )
	{
		return {
			type: "createRoom/setField",
			payload: { key, value },
		};
	},
};


export default CreateRoomActions;
