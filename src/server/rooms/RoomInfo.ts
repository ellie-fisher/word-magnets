import IRoomInfo from "../../common/rooms/IRoomInfo";


class RoomInfo implements IRoomInfo
{
	public maxClients: number;
	public timeLimit: number;
	public maxRounds: number;
	public enableChat: boolean;
	public timeLeft: number;
	public currentRound: number;

	constructor ( info )
	{
		this.maxClients = info.maxClients;
		this.timeLimit = info.timeLimit;
		this.maxRounds = info.maxRounds;
		this.enableChat = info.enableChat;
		this.timeLeft = this.timeLimit;
		this.currentRound = 1;
	}

	getPublicData ()
	{
		return {
			maxClients: this.maxClients,
			timeLimit: this.timeLimit,
			maxRounds: this.maxRounds,
			enableChat: this.enableChat,
			timeLeft: this.timeLeft,
			currentRound: this.currentRound,
		};
	}
}


export default RoomInfo;
