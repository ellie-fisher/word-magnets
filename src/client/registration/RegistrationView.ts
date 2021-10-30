import m, { Component } from "mithril";

import RegistrationModel from "./RegistrationModel";
import RegistrationController from "./RegistrationController";

import "./handlers/RegisterInfo";


const RegistrationView: Component =
{
	view ()
	{
		return m ("div",
		[
			m ("h3", "Enter Your Username"),
			m ("p",
			[
				m ("label", "Username: "),
				m ("input",
				{
					type: "text",
					value: RegistrationModel.info.name,

					oninput ( event )
					{
						RegistrationModel.info.name = event.target.value;
					},

					onchange ( event )
					{
						RegistrationModel.info.name = event.target.value;
					},
				}),
				m ("button", { onclick: RegistrationController.register, }, "Register"),
			]),
			m ("p", m("strong", RegistrationModel.error)),
		]);
	},
};


export default RegistrationView;
