import IRoomInfo from "../../common/rooms/IRoomInfo";


class RoomInfo implements IRoomInfo
{
	public name: string;
	public password: string;
	public maxClients: number;
	public timeLimit: number;
	public maxRounds: number;
	public enableChat: boolean;
	public timeLeft: number;
	public currentRound: number;

	constructor ( info )
	{
		this.name = info.name;
		this.password = info.password;
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
			name: this.name,
			password: this.password,
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
