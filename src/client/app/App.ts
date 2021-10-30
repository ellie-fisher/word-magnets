import m, { Component } from "mithril";

import appState from "./state";
import AppView from "./AppView";
import Registration from "../registration/Registration";

import socket from "./socket"; /* Invoke side effects: */ socket;
import packetManager from "../packets/packetManager";


const App: Component =
{
	view ()
	{
		switch ( appState.view )
		{
			case AppView.Connecting:
			{
				return m ("div", "Connecting...");
			}

			case AppView.SocketError:
			{
				return m ("div",
				[
					m ("h3", "Socket Error"),
					m ("span", appState.socketErrorMsg),
				]);
			}

			case AppView.Registration:
			{
				return m (Registration);
			}

			default:
			{
				return m ("div", `Unhandled view: \`${AppView[appState.view]}\``);
			}
		}
	},
};


export default App;
