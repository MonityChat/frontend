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
import { Toast } from './../../../Util/Toast';
import Fetch, { HTTP_METHOD } from '../../../Util/Fetch';
import ChatInputIcon from './ChatInputIcon';

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
				Toast.error('Uploading error').send();
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
						Toast.error('Uploading error').send();
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
				<div onMouseLeave={() => setShowEmoji(false)}>
					<Picker
						onEmojiClick={onEmojiClicked}
						searchPlaceholder={'Search...'}
					/>
				</div>
			)}
			<div className="file-select chat-button">
				<ChatInputIcon icon={IoDocumentTextOutline} />
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
				<ChatInputIcon icon={BiMicrophone} onClick={onAudioClick} />
			) : (
				<ChatInputIcon
					icon={RiRecordCircleLine}
					onClick={stopAudio}
					className={'recording'}
				/>
			)}
			{!currentVideoRecorder ? (
				<ChatInputIcon icon={BiCamera} onClick={onVideoClick} />
			) : (
				<ChatInputIcon
					icon={RiRecordCircleLine}
					onClick={stopVideo}
					className={'recording'}
				/>
			)}
			<div className="image-select chat-button">
				<ChatInputIcon icon={IoImageOutline} />
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
			<ChatInputIcon
				icon={BsEmojiSmile}
				onClick={() => setShowEmoji(!showEmoji)}
			/>
			<textarea
				rows={1}
				className="message-input"
				ref={messageRef}
				onKeyDown={handleMessageInput}
			></textarea>
			<ChatInputIcon
				icon={IoSendOutline}
				onClick={sendMessage}
				className={'send'}
			/>
			{related && (
				<ChatInputIcon
					icon={BsReply}
					onClick={() => setRelated('')}
					className={'send'}
				/>
			)}
			{numberOfFiles > 0 || numberOfImages > 0 ? (
				<ChatInputIcon
					icon={AiOutlineDelete}
					onClick={discardSelectedFiles}
					className={'send'}
				/>
			) : null}
		</div>
	);
}

/**
 * Provides a Mediarecorder to record audio and video
 * @param {Boolean} audio should audio be recorded
 * @param {Boolean} video should video be recorded
 * @returns {Promise<Function, Function>} two functions one for starting and one for stopping the media
 */
const record = (audio, video) => {
	return new Promise(async (resolve) => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: audio,
			video: video,
		});
		const mediaRecorder = new MediaRecorder(stream);
		const chunks = [];

		mediaRecorder.addEventListener('dataavailable', (event) => {
			chunks.push(event.data);
		});

		const start = () => {
			mediaRecorder.start();
		};

		const stop = () => {
			return new Promise((resolve) => {
				mediaRecorder.addEventListener('stop', () => {
					const blob = new Blob(chunks, {
						type: mediaRecorder.mimeType,
					});

					resolve({ blob });
				});

				mediaRecorder.stop();
			});
		};

		resolve({ start, stop });
	});
};

/**
 * Uploads a file to the server
 * @param {File} file the file to upload
 * @param {String} chatID in which chat you upload the file
 * @param {String} fileName name of the file. Defautlt ```Date.now().toString()```
 * @param {String} embedID if you already have on. Default ```na```
 * @returns an embeID to attach on the next upload or null if something went wrong
 */
const fetchFile = async (
	file,
	chatID,
	fileName = Date.now().toString(),
	embedID = 'na'
) => {
	const data = new FormData();
	data.append('file', file);

	const res = await Fetch.new(URL.UPLOAD.FILE, HTTP_METHOD.POST, {
		chatID,
		fileName,
		embedID,
	})
		.body(data)
		.sendAndToast(
			`Uploading ${fileName}...`,
			`Uploaded ${fileName} successfully👌`,
			'Error during the upload try again 🤯'
		);

	// const res = await toast.promise(
	// 	fetch(
	// 		`${URL.UPLOAD.FILE}?chatID=${chatID}&fileName=${fileName}&embedID=${embedID}`,
	// 		{
	// 			headers: {
	// 				authorization: key,
	// 			},
	// 			method: 'POST',
	// 			body: data,
	// 		}
	// 	),
	// 	{
	// 		pending: `Uploading ${fileName}...`,
	// 		success: `Uploaded ${fileName} 👌`,
	// 		error: 'Uploading error 🤯',
	// 	}
	// );
	if (!res.ok) return null;

	const { embedID: newEmbedID } = await res.json();
	return newEmbedID;
};
