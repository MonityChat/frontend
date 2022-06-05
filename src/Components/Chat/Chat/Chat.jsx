import React from 'react';

import ChatInput from './ChatInput';
import MessageScreen from './MessageScreen';
import './Css/Chat.css';

export default function Chat() {
	
	return (
		<div className="chat">
			<MessageScreen />
			<ChatInput />
		</div>
	);
}
