import React from "react";


const Textbox = props =>
(
	<input
		type="text"
		maxLength={props.field.max}
		value={props.field.value}
		onChange={props.onChange}
	/>
);


export default Textbox;
