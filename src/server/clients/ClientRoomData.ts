class ClientRoomData
{
	public clientID: string;
	public roomID: string;
	public score: number;
	public vote: number;

	constructor ( clientID: string, roomID: string = "" )
	{
		this.clientID = clientID;
		this.roomID = roomID;
		this.score = 0;
		this.vote = -1;
	}

	cache ()
	{
		return { score: this.score };
	}

	applyCachedData ( data: any )
	{
		this.score = data.score;
		this.vote = data.vote;
	}

	clear ()
	{
		this.roomID = "";
		this.score = 0;
		this.vote = -1;
	}

	clearVoteData ()
	{
		this.vote = -1;
	}

	clearScore ()
	{
		this.score = 0;
	}

	handleNewRound ()
	{
		this.clearVoteData ();
	}

	handleNewGame ()
	{
		this.clearVoteData ();
		this.clearScore ();
	}

	handleLeaveRoom ()
	{
		this.clear ();
	}

	toJSON (): object
	{
		return { score: this.score };
	}
}


export default ClientRoomData;
