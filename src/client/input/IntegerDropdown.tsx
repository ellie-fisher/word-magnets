import React from "react";


const IntegerDropdown = props =>
{
	const options = [];
	const { increments, min, max, value } = props.field;

	for ( let i = min; i <= max; i += increments )
	{
		options.push (<option key={`${props.keyPrefix}-${i}`} value={i}>{i}</option>);
	}

	return <select value={value} onChange={props.onChange}>{options}</select>;
};


export default IntegerDropdown;
