import m, { Component } from "mithril";

import AppModel from "./AppModel";
import ViewEnum from "./ViewEnum";

import RegistrationView from "../registration/RegistrationView";
import MainMenuView from "../mainMenu/MainMenuView";
import CreateRoomView from "../createRoom/CreateRoomView";
import JoinRoomView from "../joinRoom/JoinRoomView";
import RoomView from "../room/RoomView";

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
				return m (MainMenuView);
			}

			case ViewEnum.CreateRoom:
			{
				return m (CreateRoomView);
			}

			case ViewEnum.JoinRoom:
			{
				return m (JoinRoomView);
			}

			case ViewEnum.Room:
			{
				return m (RoomView);
			}

			default:
			{
				return m ("div", `Unhandled view: \`${ViewEnum[AppModel.view]}\``);
			}
		}
	},
};


export default AppView;
