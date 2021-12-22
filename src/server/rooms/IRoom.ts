import RoomInfo from "./RoomInfo";
import RoomClients from "./RoomClients";
import RoomWordbanks from "./RoomWordbanks";
import RoomSentences from "./RoomSentences";
import RoomError from "./RoomError";


interface IRoom
{
	id: string;
	info: RoomInfo;
	clients: RoomClients;
	wordbanks: RoomWordbanks;
	sentences: RoomSentences;

	handleNewRound (): void;
	handleNewGame (): void;
}


export default IRoom;
