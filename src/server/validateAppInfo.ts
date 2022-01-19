import { ValidationResult } from "../common/validation/types";
import { APP_ID, APP_VER } from "../common/config/appInfo";


const validateAppInfo = ( socket: any, request: any ): ValidationResult =>
{
	const { url } = request;
	const paramStart = url.indexOf ("?");

	if ( paramStart < 0 )
	{
		return [false, "Missing client app info"];
	}

	const params = new URLSearchParams (url.substring (paramStart));
	const required = ["appID", "appVersion"];

	const { length } = required;

	for ( let i = 0; i < length; i++ )
	{
		const paramName = required[i];

		if ( !params.has (paramName) )
		{
			return [false, [paramName, "Missing required parameter"]];
		}
	}

	if ( params.get ("appID") !== APP_ID )
	{
		return [false, ["appID", "Wrong application ID"]];
	}

	const clientVersion = parseInt (params.get ("appVersion"));

	if ( clientVersion !== APP_VER )
	{
		if ( clientVersion < APP_VER )
		{
			return [false, ["appVersion", "Client version is older than server version"]];
		}

		if ( clientVersion > APP_VER )
		{
			return [false, ["appVersion", "Client version is newer than server version"]];
		}

		return [false, ["appVersion", "Client/Server version mismatch"]];
	}

	return [true];
};


export default validateAppInfo;
