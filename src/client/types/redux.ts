interface Action
{
	type: string,
	payload?: any,
	error?: boolean,
	meta?: any,
};


export { Action };
