import { isValidIndex } from "../util";

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
		const validIndex = this.hasAt(index);

		if (validIndex)
		{
			this.words[index] = word;
		}

		return validIndex;
	}

	public hasAt(index: number): boolean
	{
		return isValidIndex(this.words, index);
	}

	public hasWord(word: string): boolean
	{
		return this.words.includes(word);
	}

	public indexOf(word: string): number
	{
		return this.words.indexOf(word);
	}

	public toJSON(): string
	{
		return JSON.stringify(this.words);
	}
};

export class NameCache
{
	#cache = new Map<string, string>();

	public addOrUpdate(id: string, name: string): boolean
	{
		const added = !this.#cache.has(id);

		this.#cache.set(id, name);

		return added;
	}

	public has(id: string): boolean
	{
		return this.#cache.has(id);
	}

	public get(id: string): string | null
	{
		return this.#cache.get(id) ?? null;
	}

	public clear(): void
	{
		this.#cache.clear();
	}
};
