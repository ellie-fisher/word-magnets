import { v4 as uuidv4 } from "uuid";


interface ObjectWithID
{
	id: string,
}


class ObjectManager<T extends ObjectWithID>
{
	public maxObjects: number;
	protected _objects: Map<string, T>;

	constructor ( maxObjects: number )
	{
		this.maxObjects = maxObjects;
		this._objects = new Map ();
	}

	add ( object: T ): boolean
	{
		if ( this.getCount () >= this.maxObjects || this.has (object.id) )
		{
			return false;
		}

		this._objects.set (object.id, object);

		return true;
	}

	create ( ...args: any[] ): T | null
	{
		if ( this.getCount () >= this.maxObjects )
		{
			return null;
		}

		const object = this._create (uuidv4 (), ...args);

		if ( this.has (object.id) )
		{
			// This should never happen, but if it does, we'll definitely want to know about it.
			throw new Error (`Object with ID \`${object.id}\` already exists, somehow`);
		}

		if ( !this.add (object) )
		{
			return null;
		}

		return object;
	}

	remove ( id: string )
	{
		this._objects.delete (id);
	}

	get ( id: string ): T | null
	{
		return this.has (id) ? this._objects.get (id) as T : null;
	}

	has ( id: string ): boolean
	{
		return this._objects.has (id);
	}

	hasReachedMax (): boolean
	{
		return this.getCount () >= this.maxObjects;
	}

	getCount (): number
	{
		return this._objects.size;
	}

	_create ( id: string, ...args: any[] ): T
	{
		throw new Error ("ObjectManager::_create() - Unimplemented!");
	}
}


export default ObjectManager;
