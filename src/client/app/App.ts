import m, { Component } from "mithril";

import appState from "./appState";
import AppView from "./AppView";

import socket from "../sockets/socket"; /* Invoke side effects: */ socket;


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

			default:
			{
				return m ("div", `Unhandled view: \`${AppView[appState.view]}\``);
			}
		}
	},
};


export default App;
