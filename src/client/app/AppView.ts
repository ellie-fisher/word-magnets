import m, { Component } from "mithril";

import appState from "./state";
import ViewEnum from "./ViewEnum";
import RegistrationView from "../registration/RegistrationView";
import MainMenu from "../mainMenu/MainMenu";

import socket from "./socket"; /* Invoke side effects: */ socket;
import packetManager from "../packets/packetManager";


const AppView: Component =
{
	view ()
	{
		switch ( appState.view )
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
					m ("span", appState.socketErrorMsg),
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
				return m ("div", `Unhandled view: \`${ViewEnum[appState.view]}\``);
			}
		}
	},
};


export default AppView;
