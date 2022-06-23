import React, { useRef, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
	IoSendOutline,
	IoDocumentTextOutline,
	IoImageOutline,
} from 'react-icons/io5';
import { BiMicrophone } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsEmojiSmile } from 'react-icons/bs';
import { BsReply } from 'react-icons/bs';
import './Css/ChatInput.css';
import Picker from 'emoji-picker-react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import {
	WEBSOCKET_URL,
	ACTION_MESSAGE_SEND,
	FILE_UPLOAD_URL,
	ACTION_USER_TYPING,
	ACTION_MESSAGE_REACT,
} from '../../../Util/Websocket.js';
import useAuthentication from '../../../Util/UseAuth';
import { SettingsContext, MESSAGE_MODES } from '../../../App';
import { ChatContext } from '../Messenger';
import { RelatedContext, ReactContext } from './Chat';

export default function ChatInput({ jumpToMessage }) {
	const [showEmoji, setShowEmoji] = useState(false);
	const [height, setHeight] = useState('4rem');
	const [files, setFiles] = useState([]);
	const [numberOfFiles, setNumberOfFiles] = useState(0);
	const [numberOfImages, setNumberOfImages] = useState(0);

	const messageRef = useRef();

	const { selectedChat } = useContext(ChatContext);
	const { related, setRelated } = useContext(RelatedContext);
	const { reactedMessage, setReactedMessage } = useContext(ReactContext);

	const { sendJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	const { messageMode } = useContext(SettingsContext);

	useEffect(() => {
		if (reactedMessage === '') return;
		setShowEmoji(true);
	}, [reactedMessage]);

	useEffect(() => {
		if (showEmoji) return;
		setReactedMessage('');
	}, [showEmoji]);

	const onEmojiClicked = (e, emojiObject) => {
		const emoji = emojiObject.emoji;

		if (reactedMessage === '') {
			messageRef.current.value += emoji;
			messageRef.current.focus();
		} else {
			sendJsonMessage({
				action: ACTION_MESSAGE_REACT,
				messageID: reactedMessage,
				reaction: emoji.codePointAt(0).toString(16),
			});
		}

		setReactedMessage('');
		setShowEmoji(false);
	};

	const sendMessage = async () => {
		const message = messageRef.current.value;
		messageRef.current.value = '';

		if (message.length <= 0 && files.length <= 0) return;

		if (selectedChat.targetId === undefined) return;

		let embedID = '';

		if (files.length > 0) {
			const [key] = useAuthentication();

			let formData = new FormData();
			formData.append('image', files[0]);

			const res = await toast.promise(
				fetch(
					`${FILE_UPLOAD_URL}?chatID=${selectedChat.chatId}&fileName=${files[0].name}&embedID=na`,
					{
						headers: {
							authorization: key,
						},
						method: 'POST',
						body: formData,
					}
				),
				{
					pending: `Uploading ${files[0].name}...`,
					success: `Uploaded ${files[0].name} 👌`,
					error: 'Uploaded error 🤯',
				}
			);
			if (!res.ok) return;
			const { embedID: newEmbedID, path } = await res.json();

			if (files.length > 1) {
				for (let i = 0; i < files.length; i++) {
					if (i === 0) continue;
					let formData = new FormData();
					formData.append('image', files[i]);
					const res = await toast.promise(
						fetch(
							`${FILE_UPLOAD_URL}?chatID=${selectedChat.chatId}&fileName=${files[i].name}&embedID=${newEmbedID}`,
							{
								headers: {
									authorization: key,
								},
								method: 'POST',
								body: formData,
							}
						),
						{
							pending: `Uploading ${files[i].name}...`,
							success: `Uploaded ${files[i].name} 👌`,
							error: 'Uploaded error 🤯',
						}
					);
				}
			}

			embedID = newEmbedID;
		}

		sendJsonMessage({
			action: ACTION_MESSAGE_SEND,
			target: selectedChat.targetId,
			embedID: embedID,
			content: message,
			sent: Date.now(),
			related: related,
		});
		setRelated('');
		setFiles([]);
		setNumberOfFiles(0);
		setNumberOfImages(0);
	};

	const handleImageSelected = (e) => {
		setFiles((prev) => [...prev, ...e.target.files]);
		setNumberOfImages((prev) => prev + e.target.files.length);
	};

	const handleFileSelected = (e) => {
		setFiles((prev) => [...prev, ...e.target.files]);
		setNumberOfFiles((prev) => prev + e.target.files.length);
	};

	const dropFile = (e) => {
		e.preventDefault();
		if (e.dataTransfer.items) {
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				if (e.dataTransfer.items[i].kind === 'file') {
					const file = e.dataTransfer.items[i].getAsFile();
					setFiles((prev) => [...prev, file]);
					setNumberOfFiles((prev) => prev + 1);
				}
			}
		} else {
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
				setFiles((prev) => [...prev, e.dataTransfer.files[i]]);
				setNumberOfFiles((prev) => prev + 1);
			}
		}
	};

	const discardSelectedFiles = () => {
		setFiles([]);
		setNumberOfFiles(0);
		setNumberOfImages(0);
	};

	const handleMessageInput = (e) => {
		if (selectedChat.chatId !== undefined) {
			sendJsonMessage({
				action: ACTION_USER_TYPING,
				target: selectedChat.targetId,
				chatID: selectedChat.chatId,
			});
		}

		if (e.key === 'Enter') {
			if (e.ctrlKey && messageMode === MESSAGE_MODES.ENTER_CTRL) {
				sendMessage();
			} else if (
				e.shiftKey &&
				messageMode === MESSAGE_MODES.ENTER_SHIFT
			) {
				sendMessage();
			} else if (
				messageMode === MESSAGE_MODES.ENTER &&
				!e.ctrlKey &&
				!e.shiftKey
			) {
				sendMessage();
				e.preventDefault();
			}
		}
	};

	return (
		<div
			className="chat-input"
			style={{ height: height }}
			onDrop={dropFile}
		>
			{showEmoji && (
				<div onMouseLeave={() => setShowEmoji(true)}>
					<Picker
						onEmojiClick={onEmojiClicked}
						searchPlaceholder={'Search...'}
					/>
				</div>
			)}
			<div className="file-select chat-button">
				<IoDocumentTextOutline
					size={'3em'}
					style={{ stroke: 'url(#base-gradient)' }}
				/>
				<input
					type="file"
					className="file-select-input"
					multiple="multiple"
					onChange={handleFileSelected}
				/>
				{numberOfFiles > 0 && (
					<div className="file-count">{numberOfFiles}</div>
				)}
			</div>
			<BiMicrophone
				className="chat-button"
				size={'3em'}
				style={{ fill: 'url(#base-gradient)' }}
			/>
			<div className="image-select chat-button">
				<IoImageOutline
					size={'3em'}
					className="file-icon"
					style={{ stroke: 'url(#base-gradient)' }}
				/>
				{numberOfImages > 0 && (
					<div className="file-count">{numberOfImages}</div>
				)}
				<input
					type="file"
					className="image-select-input"
					accept=".png, .jpeg, .jpg, .gif"
					multiple="multiple"
					onChange={handleImageSelected}
				/>
			</div>
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
				onKeyDown={handleMessageInput}
			></textarea>

			<IoSendOutline
				className="chat-button send"
				size={'3em'}
				style={{ stroke: 'url(#base-gradient)' }}
				onClick={sendMessage}
			/>
			{related && (
				<BsReply
					className="chat-button"
					size={'3em'}
					style={{ fill: 'url(#base-gradient)' }}
				/>
			)}
			{numberOfFiles > 0 || numberOfImages > 0 ? (
				<AiOutlineDelete
					className="chat-button"
					size={'3em'}
					style={{ fill: 'url(#base-gradient)' }}
					onClick={discardSelectedFiles}
				/>
			) : null}
		</div>
	);
}
