import AppModel from "../app/AppModel";
import CreateRoomModel from "./CreateRoomModel";

import ViewEnum from "../app/ViewEnum";

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
		const roomInfo = {};

		Object.keys (CreateRoomModel.fields).forEach (key =>
		{
			roomInfo[key] = CreateRoomModel.fields[key].value;
		});

		packetManager.sendRequestPacket (PacketCommand.CreateRoom,
		{
			roomInfo,

			clientInfo:
			{
				name: AppModel.clientName,
			},
		});
	},

	clickBack ()
	{
		AppModel.view = ViewEnum.MainMenu;
	},
};


export default CreateRoomController;
