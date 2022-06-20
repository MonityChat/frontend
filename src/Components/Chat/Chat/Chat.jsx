import React, { useState, createContext } from 'react';

import ChatInput from './ChatInput';
import MessageScreen from './MessageScreen';
import './Css/Chat.css';

export const RelatedContext = createContext();
export const ReactContext = createContext();

export default function Chat() {
	const [related, setRelated] = useState('');
	const [reactedMessage, setReactedMessage] = useState('');

	return (
		<div className="chat">
			<RelatedContext.Provider value={{ related, setRelated }}>
				<ReactContext.Provider
					value={{ reactedMessage, setReactedMessage }}
				>
					<MessageScreen />
					<ChatInput />
				</ReactContext.Provider>
			</RelatedContext.Provider>
		</div>
	);
}
