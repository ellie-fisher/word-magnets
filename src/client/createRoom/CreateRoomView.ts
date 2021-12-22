import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import ViewEnum from "../app/ViewEnum";

import CreateRoomController from "./CreateRoomController";
import CreateRoomModel from "./CreateRoomModel";

import "./handlers/CreateRoom";


const CreateRoomView: Component =
{
	oninit ()
	{
		CreateRoomController.setToDefaults ();
	},

	view ()
	{
		return m ("div",
		[
			m ("button",
			{
				onclick ()
				{
					CreateRoomController.clickBack ();
				},
			}, "<< Back"),

			m ("h3", "Create a Room"),

			m ("div", Object.keys (CreateRoomModel.fields).map (( key, index ) =>
			{
				const field = CreateRoomModel.fields[key];

				let input = m ("span");

				switch ( field.type )
				{
					case "string":
					{
						input = m ("input",
						{
							type: "text",
							value: field.value,
							autocomplete: "off",

							oninput ( event )
							{
								field.value = event.target.value;
							},

							onchange ( event )
							{
								field.value = event.target.value;
							},
						});

						break;
					}

					case "integer":
					{
						const options = [];
						const { increments, min, max, value } = field;

						for ( let i = min; i <= max; i += increments )
						{
							options.push (m ("option", { key: `key-${i}`, value: i, selected: i === value }, i));
						}

						const onchange = event =>
						{
							field.value = Number (event.target.value);
						};

						input = m ("select",
						{
							autocomplete: "off",
							onchange,
						},
						options);

						break;
					}

					default:
					{
						input = m ("strong", `Unknown field type \`${field.type}\``);
						break;
					}
				}

				return m ("p",
				[
					m ("label", `${field.displayName}: `),
					input,
					Array.isArray (CreateRoomModel.error) && CreateRoomModel.error[0] === key
						? CreateRoomModel.error[1]
						: "",
				]);
			})),

			typeof CreateRoomModel.error === "string"
				? m ("p", m ("strong", CreateRoomModel.error))
				: "",

			m ("button",
			{
				onclick ()
				{
					CreateRoomController.createRoom ();
				},
			}, "Create Room"),
		]);
	},
};


export default CreateRoomView;
