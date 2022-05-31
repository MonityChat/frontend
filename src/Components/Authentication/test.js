import { WEBSOCKET_URL } from '../../Util/Websocket.js';
import useAuthentication from '../../Util/UseAuth.js';

export let socket = null;

const [key] = useAuthentication();

export function initSocket() {
	if(socket !== null) return;
	socket = new WebSocket(WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to server');
		socket.send(JSON.stringify({auth: key.toString()}));
	};

	socket.onmessage = (e) => {
		console.log('Server send ' + e.data);
	};

	socket.onclose = (e) => {
		console.log("Connection closed");
	}
}

export function sendMessage(message) {
	const json = { message };
	socket.send(JSON.stringify(json));
}
