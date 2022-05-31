import React, { useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageScreen from './MessageScreen';
import { initSocket } from '../../Authentication/test.js';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Css/Chat.css';
import useAuthentication from '../../../Util/UseAuth';

export default function Chat() {
	const history = useHistory();

	useEffect(() => {
		const [key,, isLogedIn] = useAuthentication();
		if (!isLogedIn) {
			console.log('is not loged in');
			// history.push('/authentication');
			// return;
		}
		console.log('is loged in');

		initSocket();
	}, []);

	return (
		<div className="chat">
			<MessageScreen />
			<ChatInput />
		</div>
	);
}
