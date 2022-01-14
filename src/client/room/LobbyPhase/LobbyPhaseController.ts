import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";


const LobbyPhaseController =
{
	startGame ()
	{
		packetManager.sendRequestPacket (PacketCommand.StartGame);
	},
};


export default LobbyPhaseController;
