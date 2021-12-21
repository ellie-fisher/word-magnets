import { RequestError, TimeoutError } from "got";

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
import CreatePhase from "./phases/CreatePhase";
import VotePhase from "./phases/VotePhase";
import ResultsPhase from "./phases/ResultsPhase";
import GameEndPhase from "./phases/GameEndPhase";


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
			[RoomPhaseType.Create, new CreatePhase (this)],
			[RoomPhaseType.Vote, new VotePhase (this)],
			[RoomPhaseType.Results, new ResultsPhase (this)],
			[RoomPhaseType.GameEnd, new GameEndPhase (this)],
		]);

		this.phase = this._phases.get (RoomPhaseType.Create);
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

		if ( this.clients.addClient (client) )
		{
			this.sendDataPacket (PacketCommand.JoinRoom, client.toJSON ());
			this.sendInfo (client);
			this.sendPhaseData (client);
			this.sendClientList (client);

			if ( this.phase.type === RoomPhaseType.Create )
			{
				this.sendWordbanks (client);
			}
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

	nextPhase ()
	{
		switch ( this.phase.type )
		{
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
				this.phase = this._phases.get (RoomPhaseType.Create);
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

				this.nextPhase ();
				await this.startPhase ();

				if ( this.phase.type === RoomPhaseType.Create )
				{
					if ( prevPhase.type !== RoomPhaseType.Create )
					{
						this.handleNewRound ();
					}

					if ( prevPhase.type === RoomPhaseType.GameEnd )
					{
						this.handleNewGame ();
					}
				}
			});
		}
		catch ( error )
		{
			// TODO: Determine whether or not I want to keep this.
			console.error ("onPreStart() -", error);

			this.destroy (error instanceof RequestError || error instanceof TimeoutError
				? "An API error occurred."
				: "An internal server error occurred."
			);

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
			this.sendDataPacket (PacketCommand.RoomInfo, this.toJSON ());
		}
		else
		{
			client.packets.sendDataPacket (PacketCommand.RoomInfo, this.toJSON ());
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

	sendWordbanks ( client?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this.sendDataPacket (PacketCommand.Wordbanks, this.wordbanks.toJSON ());
		}
		else
		{
			client.packets.sendDataPacket (PacketCommand.Wordbanks, this.wordbanks.toJSON ());
		}
	}

	isFull (): boolean
	{
		return this.clients.size >= this.info.maxClients;
	}

	toJSON (): object
	{
		const data: any = this.info.toJSON ();
		const owner = this.clients.getOwner ();

		data.id = this.id;
		data.ownerID = owner.id;
		data.ownerName = owner.info.name;
		data.numClients = this.clients.size;

		return data;
	}
}


export default Room;
