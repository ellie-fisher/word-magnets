import m, { Component } from "mithril";

import AppModel from "./AppModel";
import ViewEnum from "./ViewEnum";
import RegistrationView from "../registration/RegistrationView";
import MainMenu from "../mainMenu/MainMenu";

import socket from "./socket"; /* Invoke side effects: */ socket;
import packetManager from "../packets/packetManager";


const AppView: Component =
{
	view ()
	{
		switch ( AppModel.view )
		{
			case ViewEnum.Connecting:
			{
				return m ("div", "Connecting...");
			}

			case ViewEnum.SocketError:
			{
				return m ("div",
				[
					m ("h3", "Socket Error"),
					m ("span", AppModel.socketErrorMsg),
				]);
			}

			case ViewEnum.Registration:
			{
				return m (RegistrationView);
			}

			case ViewEnum.MainMenu:
			{
				return m (MainMenu);
			}

			default:
			{
				return m ("div", `Unhandled view: \`${ViewEnum[AppModel.view]}\``);
			}
		}
	},
};


export default AppView;
