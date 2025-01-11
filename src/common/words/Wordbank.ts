import { isValidIndex } from "../util.js";

export class Wordbank
{
	public words: string[];

	constructor(words: string[] = [])
	{
		this.words = words;
	}

	public add(word: string): void
	{
		this.words.push(word);
	}

	public set(index: number, word: string): boolean
	{
		let validIndex = false;

		if (this.has(index))
		{
			this.words[index] = word;
			validIndex = true;
		}

		return validIndex;
	}

	public has(index: number): boolean
	{
		return isValidIndex(this.words, index);
	}

	public toJSON(): string
	{
		return JSON.stringify(this.words);
	}
};

/**
 * An entry in the `NameCache` class.
 */
export interface NameCacheEntry
{
	clientID: string;
	name: string;
	index: number;
};

/**
 * A class to help with name wordbank implementation.
 */
export class NameCache
{
	#cache: NameCacheEntry[] = [];

	public clear(): void
	{
		this.#cache = [];
	}

	/**
	 * Adds or updates a client name entry.
	 *
	 * @returns A tuple containing the entry and whether a new entry was created.
	 */
	public add(clientID: string, name: string): [NameCacheEntry, boolean]
	{
		let entry = this.find(clientID);
		const created = entry === null;

		if (created)
		{
			this.#cache.push(entry = { clientID, name, index: this.#cache.length });
		}
		else
		{
			(entry as NameCacheEntry).name = name;
		}

		return [entry as NameCacheEntry, created];
	}

	public get(index: number): NameCacheEntry | null
	{
		return isValidIndex(this.#cache, index) ? this.#cache[index] : null;
	}

	public find(clientID: string): NameCacheEntry | null
	{
		return this.#cache.find(test => test.clientID === clientID) || null;
	}

	public indexOf(clientID: string): number
	{
		return this.#cache.findIndex(test => test.clientID === clientID);
	}
};
