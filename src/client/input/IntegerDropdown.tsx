import React from "react";
import Select from "react-select";


const styles: any =
{
	control: provided =>
	({
		...provided,

		background: "none",
		outline: "none",
		boxShadow: "none",

		color: "#CCFF77",

		border: "0.1em dashed",
		borderRadius: "0px",
		borderColor: "#CCFF77 !important",

		paddingRight: "0.25em",
		margin: "0.15em",

		width: "3em",

		"&:hover":
		{
			backgroundColor: "rgba(0, 0, 0, 0.1)",
		},
	}),

	menu: provided =>
	({
		position: "absolute",
		width: "7vw",
		height: "3.5vw",
	}),

	option: provided =>
	({
		...provided,

		color: "#AAFF66",
		background: "rgba(0, 0, 0, 0.15)",
		textAlign: "left",

		overflow: "hidden",

		"&:hover":
		{
			backgroundColor: "rgba(0, 0, 0, 0.25)",
		},
	}),

	singleValue: provided =>
	({
		...provided,

		color: "#CCFF77",
		textAlign: "left",
		overflow: "hidden",
	}),

	dropdownIndicator () {},
	indicatorSeparator () {},
};

const IntegerDropdown = props =>
{
	const options = [];
	const { increments, min, max, value } = props.field;

	for ( let i = min; i <= max; i += increments )
	{
		options.push ({ value: i, label: i });
	}

	return <Select
		classNamePrefix="dropdown"
		styles={styles}
		value={{ value, label: value }}
		options={options}
		placeholder={options[0].label}
		isSearchable={false}
		onChange={props.onChange}
	/>;
};


export default IntegerDropdown;
