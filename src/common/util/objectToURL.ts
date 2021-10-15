/**
 * @param {object} object
 * @param {object} [extraParams={}]
 *
 * @returns {string}
 */
const objectToURL = ( object, extraParams = {} ): string =>
{
	const params = { ...object.params, ...extraParams };

	let url = object.url;
	let firstParam = true;

	Object.keys (params).forEach (param =>
	{
		let value = params[param];

		if ( Array.isArray (value) )
		{
			value = value.join (",");
		}

		if ( firstParam )
		{
			url += `?${param}=${value}`;
			firstParam = false;
		}
		else
		{
			url += `&${param}=${value}`;
		}
	});

	return encodeURI (url);
};


export default objectToURL;
