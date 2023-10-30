const socket = io();

const display = document.getElementById("display");

socket.on("command", packet => {
	const {command, args} = packet;
	console.log(command, ...args);
	display.innerText = JSON.stringify(packet, null, 4);
});
