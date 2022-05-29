import React, { useRef, useState } from 'react';
import {
	IoSendOutline,
	IoDocumentTextOutline,
	IoImageOutline,
} from 'react-icons/io5';
import { BiMicrophone } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs';
import './Css/ChatInput.css';
import Picker from 'emoji-picker-react';

export default function ChatInput() {
	const [showEmoji, setShowEmoji] = useState(false);
	const messageRef = useRef();

	const onEmojiClicked = (e, emojiObject) => {
		messageRef.current.value += emojiObject.emoji;
		setShowEmoji(false);
	};

	const sendMessage = () => {
		const message = messageRef.current.value;
		messageRef.current.value = '';

		if(message.length <= 0) return;

		console.log(`send message ${message}`);
	};

	return (
		<div className="chat-input">
			{showEmoji && (
				<Picker
					onEmojiClick={onEmojiClicked}
					searchPlaceholder={'Search...'}
				/>
			)}

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
				onClick={() => setShowEmoji(!showEmoji)}
			/>
			<textarea
				rows={1}
				className="message-input"
				ref={messageRef}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && e.ctrlKey) sendMessage();
				}}
			></textarea>

			<IoSendOutline
				className="chat-button send"
				size={'3em'}
				style={{ stroke: 'url(#base-gradient)' }}
				onClick={sendMessage}
			/>
		</div>
	);
}
