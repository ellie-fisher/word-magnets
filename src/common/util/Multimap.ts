/**
 * A data structure for storing multiple values in the same key.
 */
class Multimap
{
	protected _map: Map<any, any>;
	protected _size: number;

	constructor ()
	{
		this._map = new Map ();
		this._size = 0;
	}

	/**
	 * Adds a value at the key.
	 *
	 * @param {*} key
	 * @param {*} value
	 *
	 * @returns {number} Number of values now at the key.
	 */
	add ( key, value ): number
	{
		const map = this._map;

		if ( !map.has (key) )
		{
			map.set (key, new Set ());
		}

		const set = map.get (key);

		if ( !set.has (value) )
		{
			set.add (value);
			this._size++;
		}

		return set.size;
	}

	/**
	 * Deletes a value from a key.
	 *
	 * @param {*} key - The key we want to delete a value/values from.
	 * @param {*} value - The value we want to delete.
	 *
	 * @returns {number} Number of values now at the key, or -1 if not found.
	 */
	delete ( key, value ): number
	{
		const map = this._map;

		if ( !map.has (key) )
		{
			return -1;
		}

		const set = map.get (key);

		if ( set.has (value) )
		{
			set.delete (value);
			this._size--;
		}

		// If there's nothing in the set, we don't need it anymore so just delete it.
		if ( set.size <= 0 )
		{
			map.delete (key);
		}

		return set.size;
	}

	/**
	 * Deletes all values at a key.
	 *
	 * @param {*} key
	 */
	deleteAll ( key )
	{
		const map = this._map;

		if ( !map.has (key) )
		{
			return;
		}

		this._size -= map.get (key).size;

		map.get (key).clear ();
		map.delete (key);
	}

	/**
	 * Get all keys.
	 *
	 * @param {*} key
	 * @returns {Array} The values at the key.
	 */
	getKeys ()
	{
		const keys = [];

		this._map.forEach (( value, key ) => keys.push (key));

		return keys;
	}

	/**
	 * Get all values at a key.
	 *
	 * @param {*} key
	 * @returns {Array} The values at the key.
	 */
	getValuesAt ( key )
	{
		const values = [];

		if ( this._map.has (key) )
		{
			this._map.get (key).forEach (value => values.push (value));
		}

		return values;
	}

	/**
	 * When both `key` and `value` are supplied, it checks whether `value` is at `key`.
	 * When `value` is omitted, it checks whether there's any value at all at `key`.
	 *
	 * @param {*} key
	 * @param {*} [value]
	 *
	 * @returns {boolean}
	 */
	has ( key, value? )
	{
		if ( arguments.length === 1 )
		{
			return this._map.has (key);
		}

		return this._map.has (key) && this._map.get (key).has (value);
	}

	/**
	 * Clears the whole set map.
	 */
	clear ()
	{
		this._map.clear ();
		this._size = 0;
	}

	/**
	 * Calls a callback function for all values mapped to the key.
	 *
	 * @param {*} key
	 * @param {Function} callback
	 */
	forEach ( key, callback )
	{
		const map = this._map;

		if ( map.has (key) )
		{
			map.get (key).forEach (value => callback (value));
		}
	}

	get size (): number
	{
		return this._size;
	}
}

export default Multimap;
