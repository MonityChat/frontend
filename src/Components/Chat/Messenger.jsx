import React, { useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import StatusBar from './StatusBar/StatusBar';
import './Css/Messenger.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import useAuthentication from '../../Util/UseAuth';
import { WEBSOCKET_URL } from '../../Util/Websocket';

export default function Messenger() {
	const history = useHistory();

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	useEffect(() => {
		const [key, , isLogedIn] = useAuthentication();
		if (!isLogedIn) {
			console.log('is not loged in');
			// history.push('/authentication');
			// return;
		}
		console.log('is loged in');

		sendJsonMessage({ auth: key });

		document.title = 'Monity | Chat';
	}, []);

	useEffect(() => {
		if (lastJsonMessage === null) return;

		if (lastJsonMessage.error) {
			console.log("doesn't has the permission");
			history.push('/authentication');
			return;
		}
	}, [lastJsonMessage]);

	return (
		<div className="messenger">
			<Sidebar />
			<div className="placeholder"></div>
			<Chat />
			<StatusBar />
		</div>
	);
}
