import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import ViewEnum from "../../app/ViewEnum";
import AppModel from "../../app/AppModel";
import packetManager from "../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.ClientConnected, ( packet: Packet ) =>
{
	AppModel.clientID = packet.body;
	AppModel.view = ViewEnum.MainMenu;
});
