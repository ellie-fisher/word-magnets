import RegistrationModel from "./RegistrationModel";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";


const RegistrationController =
{
	register ()
	{
		packetManager.sendRequestPacket (PacketCommand.RegisterInfo, RegistrationModel.info);
	},
};


export default RegistrationController;
