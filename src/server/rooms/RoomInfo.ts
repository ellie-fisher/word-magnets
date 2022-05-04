import IRoomInfo from "../../common/rooms/IRoomInfo";

import { AnyObject } from "../../common/util/types";


class RoomInfo implements IRoomInfo
{
	public maxClients: number;
	public timeLimit: number;
	public maxRounds: number;
	public timeLeft: number;
	public currentRound: number;

	constructor ( info )
	{
		this.maxClients = info.maxClients;
		this.timeLimit = info.timeLimit;
		this.maxRounds = info.maxRounds;
		this.timeLeft = this.timeLimit;
		this.currentRound = 1;
	}

	getPublicData (): AnyObject
	{
		return {
			maxClients: this.maxClients,
			timeLimit: this.timeLimit,
			maxRounds: this.maxRounds,
			timeLeft: this.timeLeft,
			currentRound: this.currentRound,
		};
	}
}


export default RoomInfo;
