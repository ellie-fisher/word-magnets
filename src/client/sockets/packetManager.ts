import Packet from "../../common/packets/Packet";
import PacketManager from "../../common/packets/PacketManager";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";

import socket from "./socket";


const packetManager = new PacketManager (socket, packet =>
{
	console.error ("Unhandled packet:", packet);
});


export default packetManager;
