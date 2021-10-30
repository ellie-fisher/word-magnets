/**
 * IRoomInfo interface.
 *
 * For the server class, @see `server/rooms/RoomInfo.ts`
 */

interface IRoomInfo
{
	name: string;
	password: string;
	maxClients: number;
	timeLimit: number;
	maxRounds: number;
	enableChat: boolean;
	showOnList: boolean;
	timeLeft: number;
	currentRound: number;
};


export default IRoomInfo;
