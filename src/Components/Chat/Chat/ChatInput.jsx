import Picker from 'emoji-picker-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCamera, BiMicrophone } from 'react-icons/bi';
import { BsEmojiSmile, BsReply } from 'react-icons/bs';
import {
	IoDocumentTextOutline,
	IoImageOutline,
	IoSendOutline,
} from 'react-icons/io5';
import { RiRecordCircleLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { MESSAGE_MODES, SettingsContext } from '../../../App';
import useAuthentication from '../../../Hooks/UseAuth';
import { ACTION, URL } from '../../../Util/Websocket.js';
import { ChatContext } from '../Messenger';
import useAction from './../../../Hooks/useAction';
import { ReactContext, RelatedContext } from './Chat';
import './Css/ChatInput.css';

/**
 * Component for the user input in the chat.
 * It handles the sending of the message and additional data.
 * It also creates the media stream if a user records audio or video.
 * It holds the files which get selected by the user and will send them with the message.
 */
export default function ChatInput({ jumpToMessage }) {
	const [showEmoji, setShowEmoji] = useState(false);
	const [height, setHeight] = useState('4rem');
	const [files, setFiles] = useState([]);
	const [currentAudioRecorder, setCurrentAudioRecorder] = useState();
	const [currentVideoRecorder, setCurrentVideoRecorder] = useState();
	const [numberOfFiles, setNumberOfFiles] = useState(0);
	const [numberOfImages, setNumberOfImages] = useState(0);

	const messageRef = useRef();

	const { selectedChat } = useContext(ChatContext);
	const { related, setRelated } = useContext(RelatedContext);
	const { reactedMessage, setReactedMessage } = useContext(ReactContext);

	const { sendJsonMessage } = useAction();

	const { messageMode } = useContext(SettingsContext);

	useEffect(() => {
		setRelated('');
		setFiles([]);
		setNumberOfFiles(0);
		setNumberOfImages(0);
	}, [selectedChat]);

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
				action: ACTION.MESSAGE.REACT,
				messageID: reactedMessage,
				reaction: emoji.codePointAt(0).toString(16),
			});
		}

		setReactedMessage('');
		setShowEmoji(false);
	};

	//upload the images first, then send the message
	const sendMessage = async () => {
		const message = messageRef.current.value;
		messageRef.current.value = '';

		if (message.length <= 0 && files.length <= 0) return;

		if (selectedChat.targetId === undefined) return;

		let embedID = '';

		if (files.length > 0) {
			const [key] = useAuthentication();

			embedID = await fetchFile(
				files[0],
				selectedChat.chatId,
				files[0].name,
				'na',
				key
			);

			if (embedID === null) {
				toast.error('Uploading error');
				return;
			}

			if (files.length > 1) {
				for (let i = 0; i < files.length; i++) {
					if (i === 0) continue;
					const res = await fetchFile(
						files[i],
						selectedChat.chatId,
						files[i].name,
						embedID,
						key
					);
					if (res === null) {
						toast.error('Uploading error');
						return;
					}
				}
			}
		}

		sendJsonMessage({
			action: ACTION.MESSAGE.SEND,
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

	const stopAudio = async () => {
		if (currentAudioRecorder === null) return;

		const { audioBlob } = await currentAudioRecorder.stop();

		const [key] = useAuthentication();

		let formData = new FormData();
		formData.append('audio-file', audioBlob);

		const res = await toast.promise(
			fetch(
				`${URL.UPLOAD.FILE}?chatID=${
					selectedChat.chatId
				}&fileName=${Date.now()}.webm&embedID=na`,
				{
					headers: {
						authorization: key,
					},
					method: 'POST',
					body: formData,
				}
			),
			{
				pending: `Uploading audio ...`,
				success: `Uploaded audio👌`,
				error: 'Uploading error 🤯',
			}
		);
		const { embedID } = await res.json();

		sendJsonMessage({
			action: ACTION.MESSAGE.SEND,
			target: selectedChat.targetId,
			embedID: embedID,
			content: '',
			sent: Date.now(),
			related: related,
		});

		setCurrentAudioRecorder(null);
	};

	const stopVideo = async () => {
		if (currentVideoRecorder === null) return;

		const { audioBlob } = await currentVideoRecorder.stop();

		const [key] = useAuthentication();

		let formData = new FormData();
		formData.append('audio-file', audioBlob);

		const res = await toast.promise(
			fetch(
				`${URL.UPLOAD.FILE}?chatID=${
					selectedChat.chatId
				}&fileName=${Date.now()}.mp4&embedID=na`,
				{
					headers: {
						authorization: key,
					},
					method: 'POST',
					body: formData,
				}
			),
			{
				pending: `Uploading video...`,
				success: `Uploaded video 👌`,
				error: 'Uploading error 🤯',
			}
		);
		const { embedID } = await res.json();

		sendJsonMessage({
			action: ACTION.MESSAGE.SEND,
			target: selectedChat.targetId,
			embedID: embedID,
			content: '',
			sent: Date.now(),
			related: related,
		});

		setCurrentVideoRecorder(null);
	};

	const onAudioClick = async () => {
		const recorder = await record(true, false);
		recorder.start();
		setCurrentAudioRecorder(recorder);
	};

	const discardSelectedFiles = () => {
		setFiles([]);
		setNumberOfFiles(0);
		setNumberOfImages(0);
	};

	const onVideoClick = async () => {
		const recorder = await record(true, true);
		recorder.start();
		setCurrentVideoRecorder(recorder);
	};

	const handleMessageInput = (e) => {
		if (selectedChat.chatId !== undefined) {
			sendJsonMessage({
				action: ACTION.USER.TYPING,
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
			{!currentAudioRecorder ? (
				<BiMicrophone
					className="chat-button"
					size={'3em'}
					style={{ fill: 'url(#base-gradient)' }}
					onClick={onAudioClick}
				/>
			) : (
				<RiRecordCircleLine
					className="chat-button recording"
					size={'3em'}
					style={{ fill: 'url(#base-gradient)' }}
					onClick={stopAudio}
				/>
			)}
			{!currentVideoRecorder ? (
				<BiCamera
					className="chat-button"
					size={'3em'}
					style={{ fill: 'url(#base-gradient)' }}
					onClick={onVideoClick}
				/>
			) : (
				<RiRecordCircleLine
					className="chat-button recording"
					size={'3em'}
					style={{ fill: 'url(#base-gradient)' }}
					onClick={stopVideo}
				/>
			)}
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
					onClick={() => setRelated('')}
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

/**
 * gets a mediastream from the user if one is available and saves the
 * chunks given from the stream in an array. Then returns a promise with wich you can
 * start and stop the media
 */
const record = (audio, video) => {
	return new Promise((resolve) => {
		navigator.mediaDevices
			.getUserMedia({ audio: audio, video: video }) //stream bekommen
			.then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);
				const chunks = []; //chunks hier speichern

				mediaRecorder.addEventListener('dataavailable', (event) => {
					chunks.push(event.data); // bei neuen chunks sie in den array einfügen
				});

				const start = () => {
					//zum starten
					mediaRecorder.start();
				};

				const stop = () => {
					return new Promise((resolve) => {
						mediaRecorder.addEventListener('stop', () => {
							const audioBlob = new Blob(chunks, {
								type: mediaRecorder.mimeType,
							});

							resolve({ audioBlob });
						});

						mediaRecorder.stop();
					});
				};

				resolve({ start, stop });
			});
	});
};

/**
 * fetches a file to the server and returns an embedID
 */
const fetchFile = async (file, chatID, fileName, embedID = 'na', key) => {
	let formData = new FormData();
	formData.append('file', file);

	const res = await toast.promise(
		fetch(
			`${URL.UPLOAD.FILE}?chatID=${chatID}&fileName=${fileName}&embedID=${embedID}`,
			{
				headers: {
					authorization: key,
				},
				method: 'POST',
				body: formData,
			}
		),
		{
			pending: `Uploading ${fileName}...`,
			success: `Uploaded ${fileName} 👌`,
			error: 'Uploading error 🤯',
		}
	);
	if (!res.ok) return null;

	const { embedID: newEmbedID } = await res.json();

	return newEmbedID;
};
