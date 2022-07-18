import Picker from 'emoji-picker-react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCamera, BiMicrophone } from 'react-icons/bi';
import { BsEmojiSmile, BsReply } from 'react-icons/bs';
import {
	IoDocumentTextOutline,
	IoImageOutline,
	IoSendOutline,
} from 'react-icons/io5';
import { RiRecordCircleLine } from 'react-icons/ri';
import { MESSAGE_MODES, SettingsContext } from '../../../App';
import Fetch, { HTTP_METHOD } from '../../../Util/Fetch';
import { ACTION, URL } from '../../../Util/Websocket.js';
import { ChatContext } from '../Messenger';
import useAction from './../../../Hooks/useAction';
import { Toast } from './../../../Util/Toast';
import { ReactContext, RelatedContext } from './Chat';
import ChatInputIcon from './ChatInputIcon';
import './Css/ChatInput.css';
import MediaSelectBin from './MediaSelectBin';

/**
 * Component for the user input in the chat.
 * It handles the sending of the message and additional data.
 * It also creates the media stream if a user records audio or video.
 * It holds the files which get selected by the user and will send them with the message.
 */
export default function ChatInput() {
	const [showEmoji, setShowEmoji] = useState(false);
	const [files, setFiles] = useState([]);
	const [currentAudioRecorder, setCurrentAudioRecorder] = useState();
	const [currentVideoRecorder, setCurrentVideoRecorder] = useState();
	const [numberOfFiles, setNumberOfFiles] = useState(0);
	const [numberOfImages, setNumberOfImages] = useState(0);

	const [recorder, setRecorder] = useState(null);
	const [recorderType, setRecorderType] = useState(null);
	const [medias, setMedias] = useState([]);

	const [disabled, setDisabled] = useState(false);
	const [draggingOver, setDraggingOver] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const messageRef = useRef();

	const { selectedChat } = useContext(ChatContext);
	const { related, setRelated } = useContext(RelatedContext);
	const { reactedMessage, setReactedMessage } = useContext(ReactContext);

	const { sendJsonMessage } = useAction();

	const { messageMode } = useContext(SettingsContext);

	const mediaCount = useMemo(
		() =>
			medias.reduce(
				(result, file) => {
					if (file.type in result) {
						result[file.type] += 1;
					} else {
						result[file.type] = 1;
					}
					return result;
				},
				{ total: medias.length }
			),
		[medias]
	);

	useEffect(() => {
		setRelated('');
		setReactedMessage('');
		setMedias([]);
		setRecorder(null);
		setRecorderType(null);
		setShowDelete(false);
	}, [selectedChat]);

	useEffect(() => {
		if (reactedMessage === '') return;
		setShowEmoji(true);
	}, [reactedMessage]);

	useEffect(() => {
		if (showEmoji) return;
		setReactedMessage('');
	}, [showEmoji]);

	const onEmojiClicked = (_, emojiObject) => {
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

	const sendMessage = async () => {
		const message = messageRef.current.value;
		messageRef.current.value = '';

		if (recorder) {
			Toast.info('The Browser is still recording, stop the record first');
			return;
		}

		if (message.length <= 0 && medias.length <= 0) return;

		if (selectedChat.targetId === undefined) return;

		setDisabled(true);
		let embedID = '';

		if (medias.length > 0) {
			embedID = await fetchFile(
				medias[0].data,
				selectedChat.chatId,
				medias[0].name
			);

			if (embedID === null) {
				Toast.error('Uploading error, can not send message').send();
				setDisabled(false);
				return;
			}

			Toast.success(`Uploaded ${medias[0].name} successfully👌`);

			if (medias.length > 1) {
				medias.forEach(async (media, i) => {
					if (i === 0) return;

					const res = await fetchFile(
						media.data,
						selectedChat.chatId,
						media.name,
						embedID
					);

					if (res === null) {
						Toast.error(
							'Uploading error, can not send message'
						).send();
						setDisabled(false);
						return;
					}

					Toast.success(`Uploaded ${media.name} successfully👌`);
				});
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
		setMedias([]);
		setDisabled(false);
	};

	const handleImageSelected = (e) => {
		const files = [...e.target.files];

		setMedias((prev) => [
			...prev,
			...files.map((file) => ({
				name: file.name,
				data: file,
				type: 'image',
			})),
		]);
	};

	const handleFileSelected = (e) => {
		const files = [...e.target.files];

		setMedias((prev) => [
			...prev,
			...files.map((file) => ({
				name: file.name,
				data: file,
				type: 'file',
			})),
		]);
	};

	const dropFile = (e) => {
		e.preventDefault();
		if (e.dataTransfer.items) {
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				if (e.dataTransfer.items[i].kind === 'file') {
					const file = e.dataTransfer.items[i].getAsFile();
					setFiles((prev) => [
						...prev,
						{
							name: Date.now().toString(),
							data: file,
							type: 'file',
						},
					]);
				}
			}
		} else {
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
				setFiles((prev) => [
					...prev,
					{
						name: Date.now().toString(),
						data: e.dataTransfer.files[i],
						type: 'file',
					},
				]);
			}
		}
		setDraggingOver(false);
	};

	const stopAudio = async () => {
		if (recorder === null) return;
		if (recorderType !== 'audio') return;

		const blob = await recorder.stop();

		setMedias((prev) => [
			...prev,
			{
				name: 'Audio_' + Date.now().toString(),
				data: blob,
				type: 'audio',
			},
		]);

		setRecorder(null);
		setRecorderType(null);
	};

	const stopVideo = async () => {
		if (recorder === null) return;
		if (recorderType !== 'video') return;

		const blob = await recorder.stop();

		setMedias((prev) => [
			...prev,
			{
				name: 'Video_' + Date.now().toString(),
				data: blob,
				type: 'video',
			},
		]);

		setRecorder(null);
		setRecorderType(null);
	};

	const onAudioClick = async () => {
		const recorder = await record(true, false);
		recorder.start();
		setRecorder(recorder);
		setRecorderType('audio');
	};

	const onVideoClick = async () => {
		const recorder = await record(true, true);
		recorder.start();
		setRecorder(recorder);
		setRecorderType('video');
	};

	const discardFile = (fileName) => {
		if (!fileName) {
			setMedias([]);
		} else {
			setMedias((prev) =>
				prev.filter((media) => media.name !== fileName)
			);
		}
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
			className={`chat-input ${(disabled && 'disabled') || ''} ${
				(draggingOver && 'dropping') || ''
			}`}
			onDrop={dropFile}
			onDragOver={() => setDraggingOver(true)}
			onDragLeave={() => setDraggingOver(false)}
			onDragEnd={() => setDraggingOver(false)}
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
				{mediaCount.file > 0 && (
					<div className="file-count">{mediaCount.file}</div>
				)}
			</div>
			{recorderType !== 'audio' ? (
				<div className="number-count">
					<ChatInputIcon icon={BiMicrophone} onClick={onAudioClick} />
					{mediaCount.audio > 0 && (
						<div className="file-count">{mediaCount.audio}</div>
					)}
				</div>
			) : (
				<ChatInputIcon
					icon={RiRecordCircleLine}
					onClick={stopAudio}
					className={'recording'}
				/>
			)}
			{recorderType !== 'video' ? (
				<div className="number-count">
					<ChatInputIcon icon={BiCamera} onClick={onVideoClick} />
					{mediaCount.video > 0 && (
						<div className="file-count">{mediaCount.video}</div>
					)}
				</div>
			) : (
				<ChatInputIcon
					icon={RiRecordCircleLine}
					onClick={stopVideo}
					className={'recording'}
				/>
			)}
			<div className="image-select chat-button">
				<ChatInputIcon icon={IoImageOutline} />
				{mediaCount.image > 0 && (
					<div className="file-count">{mediaCount.image}</div>
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
			{mediaCount.total > 0 && (
				<div className="number-count delete-count">
					<ChatInputIcon
						icon={AiOutlineDelete}
						onClick={() => setShowDelete(!showDelete)}
						className="delete"
					/>
					<MediaSelectBin
						medias={medias}
						onClick={discardFile}
						className={showDelete ? 'show-delete ' : ''}
					/>
				</div>
			)}
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

					resolve(blob);
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
			undefined,
			'Error during the upload try again 🤯'
		);

	if (!res.ok) return null;

	const { embedID: newEmbedID } = await res.json();
	return newEmbedID;
};
