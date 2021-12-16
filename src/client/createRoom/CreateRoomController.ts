import CreateRoomModel from "./CreateRoomModel";

import roomInfoFields from "../../common/validation/fields/roomInfo";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";


const CreateRoomController =
{
	setToDefaults ()
	{
		CreateRoomModel.fields = {};
		CreateRoomModel.error = [];

		Object.keys (roomInfoFields).forEach (key =>
		{
			const field = roomInfoFields[key];

			CreateRoomModel.fields[key] = { value: field.defaultValue, ...field };
		});
	},

	createRoom ()
	{
		const fields = {};

		Object.keys (CreateRoomModel.fields).forEach (key =>
		{
			fields[key] = CreateRoomModel.fields[key].value;
		});

		packetManager.sendRequestPacket (PacketCommand.CreateRoom, fields);
	},
};


export default CreateRoomController;
