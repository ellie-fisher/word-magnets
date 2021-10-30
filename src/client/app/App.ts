import m, { Component } from "mithril";

import appState from "./state";
import ViewEnum from "./ViewEnum";
import Registration from "../registration/Registration";

import socket from "./socket"; /* Invoke side effects: */ socket;
import packetManager from "../packets/packetManager";


const App: Component =
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
				return m (Registration);
			}

			default:
			{
				return m ("div", `Unhandled view: \`${ViewEnum[appState.view]}\``);
			}
		}
	},
};


export default App;
