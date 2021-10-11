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
	"DestroyRoom",

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

let packetSequence = 0;

window.onload = function ()
{
	let ws = socketConnect ();

	const $packetType = document.getElementById ("packet-type");
	const $packetCommand = document.getElementById ("packet-command");
	const $packetSequence = document.getElementById ("packet-sequence");
	const $packetBody = document.getElementById ("packet-body");
	const $packetSend = document.getElementById ("packet-send");

	$packetSend.onclick = sendPacket;


	function sendPacket ()
	{
		let bodyStr = document.getElementById ("packet-body").value;

		if ( bodyStr[bodyStr.length - 1] === "," )
		{
			bodyStr = bodyStr.substring (0, bodyStr.length - 1);
		}

		const packet =
		{
			type: $packetType.selectedIndex,
			command: $packetCommand.selectedIndex,
			sequence: packetSequence++,
			body: JSON.parse ("{" + bodyStr + "}"),
		};

		document.getElementById ("packet-sequence").value = packetSequence;

		ws.send (JSON.stringify (packet));
	};

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
};

function addMessage ( message )
{
	document.getElementById ("socket-messages").prepend (`${message}\n`);
};

function socketConnect ()
{
	const ws = new WebSocket ("ws://localhost:8080");

	ws.onopen = function ( ...args )
	{
		addMessage ("(i) Connected.");

		const packet =
		{
			type: types.indexOf ("Request"),
			command: commands.indexOf ("RegisterInfo"),
			sequence: packetSequence++,
			body: { name: String (Math.random ()) },
		};

		document.getElementById ("packet-sequence").value = packetSequence;

		ws.send (JSON.stringify (packet));
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

	return ws;
};
