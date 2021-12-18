import Client from "../clients/Client";
import Sentence from "../../common/wordbanks/Sentence";

import shuffle from "../../common/util/shuffle";


class RoomSentences
{
	protected _clients: string[];
	protected _sentences: Map<string, Sentence>;

	constructor ()
	{
		this._clients = [];
		this._sentences = new Map ();
	}

	/**
	 * Assign a randomized, anonymous vote ID to each client so other players can't figure out
	 * which sentence is whose.
	 */
	assignVoteIDs ()
	{
		shuffle (this._clients);

		this._clients.forEach (( clientID: string, index: number ) =>
		{
			this.getSentence (clientID).voteID = index;
		});
	}

	addSentence ( sentence: Sentence, client: Client )
	{
		const { id } = client;

		if ( !this.hasSentence (id) )
		{
			// Initial voteID
			sentence.voteID = this._clients.length;

			this._clients.push (id);
			this._sentences.set (id, sentence);
		}
	}

	clear ()
	{
		this._clients = [];
		this._sentences.clear ();
	}

	getSentence ( clientID: string ): Sentence | null
	{
		return this.hasSentence (clientID) ? this._sentences.get (clientID) : null;
	}

	getClientID ( voteID: number ): string
	{
		return this.isValidVoteID (voteID) ? this._clients[voteID] : "";
	}

	isValidVoteID ( voteID: number ): boolean
	{
		return Number.isInteger (voteID) && voteID >= 0 && voteID < this._clients.length;
	}

	hasSentence ( clientID: string ): boolean
	{
		return this._sentences.has (clientID);
	}

	testVoteID ( voteID: number, clientID: string ): boolean
	{
		return this.isValidVoteID (voteID) && this.hasSentence (clientID)
			&& this._clients[voteID] === clientID;
	}

	forEach ( callback: Function )
	{
		this._sentences.forEach (callback as any);
	}
}


export default RoomSentences;
