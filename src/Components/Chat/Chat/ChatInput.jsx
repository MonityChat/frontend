import React from 'react';
import {
	IoSendOutline,
	IoDocumentTextOutline,
	IoImageOutline,
} from 'react-icons/io5';
import { BiMicrophone } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs';
import './Css/ChatInput.css';

export default function ChatInput() {
	return (
		<div className="chat-input">
			<IoDocumentTextOutline
				className="chat-button"
				size={'3em'}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
			<BiMicrophone
				className="chat-button"
				size={'3em'}
				style={{ fill: 'url(#base-gradient)' }}
			/>
			<IoImageOutline
				className="chat-button"
				size={'3em'}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
			<BsEmojiSmile
				className="chat-button"
				size={'3em'}
				style={{ fill: 'url(#base-gradient)' }}
			/>

			<input type="text" className="message-input" />

			<IoSendOutline
				className="chat-button send"
				size={'3em'}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}
