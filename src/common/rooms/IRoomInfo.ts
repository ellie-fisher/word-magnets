/**
 * IRoomInfo interface.
 *
 * For the server class, @see `server/rooms/RoomInfo.ts`
 */

interface IRoomInfo
{
	id?: string;
	name: string;
	password: string;
	maxClients: number;
	timeLimit: number;
	maxRounds: number;
	enableChat: boolean;
	timeLeft: number;
	currentRound: number;
};

interface IRoomPublicData extends IRoomInfo
{
	ownerID: string;
	ownerName: string;
	numClients: number;
};


export default IRoomInfo;

export { IRoomPublicData };
