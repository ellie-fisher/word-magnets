window.onload = function ()
{
	const types = ["Data", "Request", "Response"];

	const commands =
	[
		"Error",
		"Warning",
		"Message",

		"RegisterInfo",

		"CreateRoom",
		"JoinRoom",
		"LeaveRoom",
		"DeleteRoom",

		"StartPhase",
		"EndPhase",

		"KickClient",
		"BanClient",

		"RoomInfo",

		"ClientList",
		"RoomList",

		"SendSentence",
		"SentenceList",

		"CastVote",
	];

	const $socketMessages = document.getElementById ("socket-messages");
	const $packetType = document.getElementById ("packet-type");
	const $packetCommand = document.getElementById ("packet-command");
	const $packetSequence = document.getElementById ("packet-sequence");
	const $packetBody = document.getElementById ("packet-body");
	const $packetSend = document.getElementById ("packet-send");

	$packetBody.oninput = onChangeBody;
	$packetBody.onchange = onChangeBody;
	$packetSend.onclick = sendPacket;

	types.forEach (( type, index ) =>
	{
		const $option = document.createElement ("option");

		$option.text = type;
		$option.value = index;

		$packetType.appendChild ($option);
	});

	commands.forEach (( command, index ) =>
	{
		const $option = document.createElement ("option");

		$option.text = command;
		$option.value = index;

		$packetCommand.appendChild ($option);
	});

	const ws = new WebSocket ("ws://localhost:8080");

	function addMessage ( message )
	{
		$socketMessages.prepend (`${message}\n`);
	};

	ws.onopen = function ( ...args )
	{
		addMessage ("(i) Connected.");
	};

	ws.onclose = function ( ...args )
	{
		addMessage ("(i) DISCONNECTED.");
	};

	ws.onmessage = function ( message )
	{
		addMessage (message.data);
	};

	ws.onerror = function ( error )
	{
		addMessage (`[!] ERROR: ${error}`);
	};

	let packetType = 0;
	let packetCommand = 0;
	let packetSequence = 0;
	let packetBody = "";

	function onChangeBody ( event )
	{
		packetBody = event.target.value;
	};

	function sendPacket ()
	{
		let bodyStr = packetBody;

		if ( bodyStr[bodyStr.length - 1] === "," )
		{
			bodyStr = bodyStr.substring (0, bodyStr.length - 1);
		}

		const packet = JSON.parse ("{" + bodyStr + "}");

		packet.type = packetType;
		packet.command = packetCommand;
		packet.sequence = packetSequence++;

		$packetSequence.value = packetSequence;

		ws.send (JSON.stringify (packet));
	};
};
