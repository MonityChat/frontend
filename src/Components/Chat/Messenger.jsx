import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import './Css/Messenger.css';

export default function Messenger() {
	return (
		<div className="messenger">
			<Sidebar />
			<Chat />
		</div>
	);
}
