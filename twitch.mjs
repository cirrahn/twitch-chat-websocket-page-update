import * as tmi from "tmi.js";
import {parentPort} from "worker_threads";

const client = new tmi.client({
	channels: [
		process.env.TWITCH_CHANNEL,
	],
});

client.on("message", (channelName, context, msg, isFromSelf) => {
	if (isFromSelf) return;

	msg = msg.trim();

	const {
		["display-name"]: displayName, // e.g. "Literally Me"
		mod: isMod, // e.g. `true`
		subscriber: isSubscriber, // e.g. `true`
		["user-id"]: userId, // e.g. `"1234123412"`
		username, // e.g. "literallyme"
		["message-type"]: messageType, // e.g. `chat`
	} = context;

	// A command?
	if (msg.startsWith("!")) {
		// TODO use e.g. a real command parser with quote handling
		const parts = msg
			.slice(1)
			.split(" ")
			.map(it => it.trim())
			.filter(Boolean);

		const [command, ...args] = parts;

		console.log(`Parsed message as command: ${command} ${args.join(" ")}`);

		parentPort.postMessage(JSON.stringify({
			type: "command",
			payload: {
				command,
				args,
			},
		}));

		return;
	}

	// a regular message
	console.log(`${displayName}: ${msg}`);
});

client.on("connected", (addr, port) => {
	console.log(`Connected to ${addr}:${port}`);
});

client.connect();
