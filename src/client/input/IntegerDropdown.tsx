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
			backgroundColor: "rgba(0, 0, 0, 0.15)",
		},
	}),

	menu: provided =>
	({
		position: "absolute",
		width: "3em",
		border: "0.1em solid",
		borderColor: "rgba(0, 0, 0, 0.25)",
	}),

	option: provided =>
	({
		...provided,

		color: "#FFFF99",

		background: "url(\"/img/chalkboard.png\")",
		backgroundPosition: "50% 50%",
		backgroundSize: "auto",
		backgroundColor: "#284F37",  /* Fallback color */

		textAlign: "left",

		overflow: "hidden",

		"&:hover":
		{
			backgroundColor: "rgba(1, 1, 1, 0.3)",
			backgroundBlendMode: "multiply"
		},
	}),

	singleValue: provided =>
	({
		...provided,

		color: "#FFFF99",
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
