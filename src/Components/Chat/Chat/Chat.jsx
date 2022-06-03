import React, { useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageScreen from './MessageScreen';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import './Css/Chat.css';
import useAuthentication from '../../../Util/UseAuth';
import { WEBSOCKET_URL } from '../../../Util/Websocket';

export default function Chat() {
	const history = useHistory();

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, { share: true });

	useEffect(() => {
		const [key, , isLogedIn] = useAuthentication();
		if (!isLogedIn) {
			console.log('is not loged in');
			// history.push('/authentication');
			// return;
		}
		console.log('is loged in');

		sendJsonMessage({ auth: key });
	}, []);

	useEffect(() => {
		if(lastJsonMessage === null) return;

		if(lastJsonMessage.error){
			console.log("doesn't has the permission");
			history.push('/authentication');
			return;
		}

		console.log(lastJsonMessage);

	}, [lastJsonMessage])

	return (
		<div className="chat">
			<MessageScreen />
			<ChatInput />
		</div>
	);
}
