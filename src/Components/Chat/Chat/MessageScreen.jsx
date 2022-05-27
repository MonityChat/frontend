import React from 'react';
import Message from './Message';
import './Css/MessageScreen.css';

export default function MessageScreen() {
	return (
		<div className="message-screen">
			<Message you author="Devin" time="12:12:12">Hey how are you</Message>
		</div>
	);
}
