import { v4 as uuidv4 } from "uuid";


interface ObjectWithID
{
	id: string,
};

enum ObjectCreateError
{
	Ok,
	ObjectLimit,
	AlreadyExists,
	GenerateID,
};


class ObjectManager<T extends ObjectWithID>
{
	public maxObjects: number;
	protected _objects: Map<string, T>;

	constructor ( maxObjects: number )
	{
		this.maxObjects = maxObjects;
		this._objects = new Map ();
	}

	add ( object: T ): ObjectCreateError
	{
		if ( this.getCount () >= this.maxObjects )
		{
			return ObjectCreateError.ObjectLimit;
		}

		if ( this.has (object.id) )
		{
			return ObjectCreateError.AlreadyExists;
		}

		this._objects.set (object.id, object);

		return ObjectCreateError.Ok;
	}

	create ( ...args: any[] ): T | ObjectCreateError
	{
		if ( this.getCount () >= this.maxObjects )
		{
			return ObjectCreateError.ObjectLimit;
		}

		const id = this._generateID ();

		if ( id === "" )
		{
			return ObjectCreateError.GenerateID;
		}

		const object = this._create (id, ...args);

		if ( this.has (object.id) )
		{
			// This should never happen, but if it does, we'll definitely want to know about it.
			throw new Error (`Object with ID \`${object.id}\` already exists, somehow`);
		}

		const addError = this.add (object);

		if ( addError !== ObjectCreateError.Ok )
		{
			return addError;
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

	getCreateErrorMessage ( error: ObjectCreateError ): string
	{
		switch ( error )
		{
			case ObjectCreateError.Ok:
				return "";

			case ObjectCreateError.ObjectLimit:
				return "The maximum number of object has been reached.";

			case ObjectCreateError.AlreadyExists:
				return "The object already exists in the object manager.";

			case ObjectCreateError.GenerateID:
				return "Failed to create a unique object ID. Please try again later.";

			default:
				return "Unknown object creation error.";
		}
	}

	protected _create ( id: string, ...args: any[] ): T
	{
		throw new Error ("Unimplemented!");
	}

	protected _generateID (): string
	{
		return uuidv4 ();
	}
}


export default ObjectManager;

export { ObjectCreateError };
