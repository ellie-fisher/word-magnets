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

	"ChatMessage",  // TODO: Add chat capabilities

	"RoomInfo",

	"ClientList",
	"RoomList",

	"Wordbanks",
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
	const $wordbanks = document.getElementById ("wordbanks");
	const $sentence = document.getElementById ("sentence");

	$packetSend.onclick = sendPacket;

	function sendPacket ()
	{
		const bodyStr = document.getElementById ("packet-body").value;

		const packet =
		{
			type: $packetType.selectedIndex,
			command: $packetCommand.selectedIndex,
			sequence: packetSequence++,
			body: bodyStr ? JSON.parse (bodyStr) : {},
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
	const $wordbanks = document.getElementById ("wordbanks");
	const $sentence = document.getElementById ("sentence");

	const ws = new WebSocket ("ws://localhost:8080");

	ws.onopen = function ( ...args )
	{
		addMessage ("(i) Connected.");

		const packet =
		{
			type: types.indexOf ("Request"),
			command: commands.indexOf ("RegisterInfo"),
			sequence: packetSequence++,
			body: { name: Math.random () + "-" },
		};

		document.getElementById ("packet-sequence").value = packetSequence;

		ws.send (JSON.stringify (packet));
	};

	ws.onclose = function ( event )
	{
		if ( event.reason === "" )
		{
			addMessage ("(i) DISCONNECTED.");
		}
		else
		{
			addMessage ("(i) DISCONNECTED: \"" + event.reason + "\"");
		}
	};

	ws.onmessage = function ( message )
	{
		addMessage (message.data);

		const packet = JSON.parse (message.data);

		if ( packet.command === "Wordbanks" )
		{
			$wordbanks.innerHTML = "";
			$sentence.value = "";

			packet.body.forEach (( wordbank, bankIndex ) =>
			{
				const $wordbank = document.createElement ("span");
				const $title = document.createElement ("h3");
				const $words = document.createElement ("span");

				$title.innerText = wordbank.displayName;
				$wordbank.appendChild ($title);

				wordbank.words.forEach (( word, wordIndex ) =>
				{
					$button = document.createElement ("button");
					$button.innerText = word;

					$button.onclick = () =>
					{
						if ( $sentence.value.length > 0 )
						{
							$sentence.value += ",";
						}

						$sentence.value += JSON.stringify ({ wordbank: bankIndex, word: wordIndex });
					};

					$words.appendChild ($button);
				});

				$wordbank.appendChild ($words);
				$wordbanks.appendChild ($wordbank);
			});
		}
	};

	ws.onerror = function ( event )
	{
		addMessage (`[!] ERROR: ${event}`);
	};

	return ws;
};
