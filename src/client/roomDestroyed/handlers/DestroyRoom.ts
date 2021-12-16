import Packet from "../../../common/packets/Packet";
import PacketType from "../../../common/packets/PacketType";
import PacketCommand from "../../../common/packets/PacketCommand";

import AppModel from "../../app/AppModel";
import RoomDestroyedModel from "../RoomDestroyedModel";
import ViewEnum from "../../app/ViewEnum";

import packetManager from "../../packets/packetManager";


packetManager.on (PacketType.Data, PacketCommand.DestroyRoom, ( packet: Packet ) =>
{
	AppModel.view = ViewEnum.RoomDestroyed;
	RoomDestroyedModel.reason = packet.body;
});
