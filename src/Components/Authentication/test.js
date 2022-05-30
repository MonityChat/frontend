import { WEBSOCKET_URL } from '../../Util/Websocket.js';

export let socket;

export function initSocket() {
	socket = new WebSocket(WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to server');
	};

	socket.onmessage = (e) => {
		console.log('Server send ' + e.data);
	};
}

export function sendMessage(message) {
	console.log("isJson" + message);
	const json = { message };
	socket.send(json);
}
