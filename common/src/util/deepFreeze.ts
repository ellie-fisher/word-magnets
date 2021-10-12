const deepFreeze = ( value: any ) =>
{
	if ( !Object.isFrozen (value) )
	{
		if ( Array.isArray (value) )
		{
			const { length } = value;

			for ( let i = 0; i < length; i++ )
			{
				deepFreeze (value[i]);
			}

			Object.freeze (value);
		}
		else if ( typeof value === 'object' )
		{
			for ( let i in value )
			{
				deepFreeze (value[i]);
			}

			Object.freeze (value);
		}
	}

	return value;
};


export default deepFreeze;