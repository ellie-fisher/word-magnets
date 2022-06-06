import IRoom from "./IRoom";
import RoomInfo from "./RoomInfo";
import RoomClients from "./RoomClients";
import RoomWordbanks from "./RoomWordbanks";
import RoomSentences from "./RoomSentences";
import RoomError from "./RoomError";

import Packet from "../../common/packets/Packet";
import PacketCommand from "../../common/packets/PacketCommand";
import Client from "../clients/Client";

import RoomPhase from "./phases/RoomPhase";
import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";

import LobbyPhase from "./phases/LobbyPhase";
import CreatePhase from "./phases/CreatePhase";
import VotePhase from "./phases/VotePhase";
import ResultsPhase from "./phases/ResultsPhase";
import GameEndPhase from "./phases/GameEndPhase";

import { AnyObject } from "../../common/util/types";


class Room implements IRoom
{
	public id: string;
	public info: RoomInfo;
	public clients: RoomClients;
	public wordbanks: RoomWordbanks;
	public sentences: RoomSentences;
	public phase: RoomPhase;

	protected _onDestroy: Function;
	protected _phases: Map<RoomPhaseType, RoomPhase>;

	constructor ( id: string, info: RoomInfo, owner: Client, onDestroy: Function = () => {} )
	{
		this.id = id;
		this.info = info;
		this._onDestroy = onDestroy;
		this.clients = new RoomClients (id, owner);
		this.wordbanks = new RoomWordbanks ();
		this.sentences = new RoomSentences ();

		this._phases = new Map (
		[
			[RoomPhaseType.Lobby, new LobbyPhase (this)],
			[RoomPhaseType.Create, new CreatePhase (this)],
			[RoomPhaseType.Vote, new VotePhase (this)],
			[RoomPhaseType.Results, new ResultsPhase (this)],
			[RoomPhaseType.GameEnd, new GameEndPhase (this)],
		]);

		this.phase = this._phases.get (RoomPhaseType.Lobby);
	}

	destroy ( reason: string = "The room was closed.", ignoreOwner: boolean = false )
	{
		if ( ignoreOwner )
		{
			this.sendDataPacket (PacketCommand.DestroyRoom, reason, [this.clients.getOwner ().id]);
		}
		else
		{
			this.sendDataPacket (PacketCommand.DestroyRoom, reason);
		}

		this.clients.clearClients ();
		this._onDestroy (this, reason);
	}

	join ( client: Client ): RoomError
	{
		if ( client.isInRoom () )
		{
			return RoomError.InRoom;
		}

		if ( this.isFull () )
		{
			return RoomError.Full;
		}

		if ( this.clients.hasName (client.name) )
		{
			return RoomError.DuplicateName;
		}

		if ( this.clients.addClient (client) )
		{
			this.sendDataPacket (PacketCommand.JoinRoom, client.getPublicData ());
			this.sendInfo (client);
			this.sendPhaseData (client);
			this.sendClientList (client);
		}

		return RoomError.Ok;
	}

	leave ( client: Client )
	{
		if ( this.clients.isOwner (client) )
		{
			this.destroy ("The room was closed.", true);
		}
		else
		{
			this.sendDataPacket (PacketCommand.LeaveRoom, client.id, [client.id]);
			this.clients.removeClient (client.id);
		}
	}

	kick ( initiator: Client, target: Client ): RoomError
	{
		if ( !this.clients.hasClient (initiator.id) )
		{
			return RoomError.NotInRoom;
		}

		if ( !this.clients.hasClient (target.id) )
		{
			return RoomError.ClientNotFound;
		}

		if ( !this.clients.isOwner (initiator) )
		{
			return RoomError.NotOwner;
		}

		if ( this.clients.isOwner (target) )
		{
			return RoomError.KickOwner;
		}

		this.sendDataPacket (PacketCommand.KickClient, target.id);
		this.leave (target);

		return RoomError.Ok;
	}

	nextPhase ()
	{
		switch ( this.phase.type )
		{
			case RoomPhaseType.Lobby:
			{
				this.phase = this._phases.get (RoomPhaseType.Create);
				break;
			}

			case RoomPhaseType.Create:
			{
				this.phase = this._phases.get (RoomPhaseType.Vote);
				break;
			}

			case RoomPhaseType.Vote:
			{
				this.phase = this._phases.get (RoomPhaseType.Results);
				break;
			}

			case RoomPhaseType.Results:
			{
				if ( this.info.currentRound < this.info.maxRounds )
				{
					this.phase = this._phases.get (RoomPhaseType.Create);
				}
				else
				{
					this.phase = this._phases.get (RoomPhaseType.GameEnd);
				}

				break;
			}

			case RoomPhaseType.GameEnd:
			{
				this.phase = this._phases.get (RoomPhaseType.Lobby);
				break;
			}

			default:
			{
				break;
			}
		}
	}

	async startPhase ()
	{
		try
		{
			await this.phase.start (async () =>
			{
				const prevPhase = this.phase;
				const prevType = prevPhase.type;

				this.nextPhase ();
				await this.startPhase ();

				if ( prevType === RoomPhaseType.Results || prevType === RoomPhaseType.GameEnd )
				{
					this.handleNewRound ();
				}

				if ( prevType === RoomPhaseType.GameEnd )
				{
					this.handleNewGame ();
				}
			});
		}
		catch ( error )
		{
			console.error ("onPreStart() -", error);  // TODO: Do I want to keep this `console.log`?

			this.destroy ("An internal server error occurred.");

			return;
		}
	}

	receivePacket ( packet: Packet, client: Client )
	{
		this.phase.receivePacket (packet, client);
	}

	handleNewRound ()
	{
		const { info } = this;

		if ( info.currentRound < info.maxRounds )
		{
			info.currentRound++;
		}

		this.sentences.clear ();

		this.clients.handleNewRound ();
		this.clients.sendDataPacket (PacketCommand.RoomInfo, { currentRound: this.info.currentRound });
	}

	handleNewGame ()
	{
		this.info.currentRound = 1;

		this.clients.handleNewGame ();
		this.clients.sendDataPacket (PacketCommand.RoomInfo, { currentRound: this.info.currentRound });
	}

	/**
	 * @param {PacketCommand} command
	 * @param {any} [body=""]
	 * @param {string[]|null} [except=null] - Client IDs to *NOT* send the packet to.
	 */
	sendDataPacket ( command: PacketCommand, body: any = "", except: string[] = null )
	{
		this.clients.sendDataPacket (command, body, except);
	}

	sendInfo ( client?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this.sendDataPacket (PacketCommand.RoomInfo, this.getPublicData ());
		}
		else
		{
			client.packets.sendDataPacket (PacketCommand.RoomInfo, this.getPublicData ());
		}
	}

	sendPhaseData ( client: Client )
	{
		this.phase.sendData (client);
	}

	sendClientList ( client?: Client )
	{
		this.clients.sendClientList (client);
	}

	isFull (): boolean
	{
		return this.clients.size >= this.info.maxClients;
	}

	getPublicData (): AnyObject
	{
		const data: AnyObject = this.info.getPublicData ();
		const owner = this.clients.getOwner ();

		data.id = this.id;
		data.ownerID = owner.id;
		data.ownerName = owner.info.name;
		data.numClients = this.clients.size;

		return data;
	}
}


export default Room;
