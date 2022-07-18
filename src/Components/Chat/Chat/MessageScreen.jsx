import React, {
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react';
import { IoArrowDown } from 'react-icons/io5';
import { ChatContext, ProfileContext } from '../Messenger';
import useAction from './../../../Hooks/useAction';
import { PushNotification, Toast } from './../../../Util/Toast';
import WSSYSTEM from './../../../Util/Websocket';
import { ReactContext, RelatedContext } from './Chat';
import './Css/MessageScreen.css';
import DayDivider from './DayDivider';
import Audio from './Message/Audio';
import File from './Message/File';
import Image from './Message/Image';
import Message from './Message/Message';
import Video from './Message/Video';

export const MESSAGE_ACTIONS = {
	ADD: 'ADD',
	SET: 'SET',
	ADD_OLDER: 'ADD_OLDER',
	REPLACE: 'REPLACE',
	DELETE: 'DELETE',
	READ: 'READ',
	RECEIVED: 'RECEIVED',
};

function messageReducer(prev, action) {
	switch (action.type) {
		case MESSAGE_ACTIONS.ADD: {
			return [...prev, action.data];
		}
		case MESSAGE_ACTIONS.SET: {
			return [...action.data.reverse()];
		}
		case MESSAGE_ACTIONS.ADD_OLDER: {
			return [...action.data.reverse(), ...prev];
		}
		case MESSAGE_ACTIONS.DELETE: {
			return prev.reduce((result, message) => {
				if (message.relatedTo?.messageID === action.data) {
					delete message.relatedTo;
				}
				if (message.messageID !== action.data) {
					result.push(message);
				}
				return result;
			}, []);
		}
		case MESSAGE_ACTIONS.REPLACE: {
			return prev.reduce((result, message) => {
				if (message.relatedTo?.messageID === action.data.messageID) {
					message.relatedTo = action.data;
				}
				if (message.messageID === action.data.messageID) {
					message = action.data;
				}

				result.push(message);
				return result;
			}, []);
		}
		case MESSAGE_ACTIONS.READ: {
			return prev.map((message) => ({
				...message,
				status: 'READ',
			}));
		}
		case MESSAGE_ACTIONS.RECEIVED: {
			return prev.map((message) => ({
				...message,
				status: 'RECEIVED',
			}));
		}
		default: {
			return prev;
		}
	}
}

/**
 * Component for displaying all the messages.
 * It handles a lot of actions and notifications
 * coming from the server and displays the messages correctly.
 * It adds the divider between the messages and maps all the data
 * to the message like attached media.
 */
export default function MessageScreen() {
	const [messages, dispatchMessages] = useReducer(messageReducer, []);
	const [scrollTo, setScrollTo] = useState('bottom');
	const [you, setYou] = useState(localStorage.getItem('userName'));
	const [other, setOther] = useState();

	const [showScrollDown, setShowScrollDown] = useState(false);

	const messageRefs = useRef({});
	const messageScreenRef = useRef();
	const bottomRef = useRef();
	const typingRef = useRef();

	const { selectedChat } = useContext(ChatContext);
	const { setReactedMessage } = useContext(ReactContext);
	const { setRelated } = useContext(RelatedContext);
	const profile = useContext(ProfileContext);

	const doNotDisturbMode = profile?.status === 'DO_NOT_DISTURB' || false;

	//scroll to bottom of page
	useEffect(() => {
		if (scrollTo === 'none') {
			setScrollTo('bottom');
			return;
		}
		if (scrollTo === 'bottom') bottomRef.current.scrollIntoView();
		else {
			if (messageRefs.current[scrollTo]?.scrollIntoView)
				messageRefs.current[scrollTo].scrollIntoView();
		}

		setScrollTo('bottom');
	}, [messages]);

	useEffect(() => {
		setYou(profile?.userName);
	}, [profile]);

	const { sendJsonMessage } = useAction(
		WSSYSTEM.ACTION.MESSAGE.GET.LATEST,
		(lastJsonMessage) => {
			if (!lastJsonMessage.content.messages) return;
			dispatchMessages({
				type: MESSAGE_ACTIONS.SET,
				data: lastJsonMessage.content.messages,
			});
			setScrollTo('bottom');
		}
	);

	useAction(WSSYSTEM.ACTION.MESSAGE.GET._, (lastJsonMessage) => {
		dispatchMessages({
			type: MESSAGE_ACTIONS.ADD_OLDER,
			data: lastJsonMessage.content.messages,
		});
		setScrollTo(lastJsonMessage.content.messages[0]?.index || 'none');
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.SEND, (lastJsonMessage) => {
		dispatchMessages({
			type: MESSAGE_ACTIONS.ADD,
			data: lastJsonMessage.content,
		});
		setScrollTo('bottom');
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.DELETE, (lastJsonMessage) => {
		dispatchMessages({
			type: MESSAGE_ACTIONS.DELETE,
			data: lastJsonMessage.content.message,
		});
		setScrollTo('none');
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.REACT, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
			return;

		dispatchMessages({
			type: MESSAGE_ACTIONS.REPLACE,
			data: lastJsonMessage.content.message,
		});

		setScrollTo('none');
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.EDIT, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
			return;

		dispatchMessages({
			type: MESSAGE_ACTIONS.REPLACE,
			data: lastJsonMessage.content.message,
		});
		setScrollTo('none');
	});

	useAction(WSSYSTEM.ACTION.PROFILE.GET.OTHER, (lastJsonMessage) => {
		setOther(lastJsonMessage.content);
	});

	useAction(
		WSSYSTEM.NOTIFICATION.MESSAGE.INCOMING,
		(lastJsonMessage, sendJsonMessage) => {
			if (selectedChat.chatId !== lastJsonMessage.content.message.chat) {
				if (doNotDisturbMode) return;
				const content = lastJsonMessage.content.message.content.slice(
					0,
					120
				);

				const mediaPath =
					lastJsonMessage.content.message.attachedMedia.length > 0
						? `${prefixDOMAIN}${DOMAIN}/assets${lastJsonMessage.content.message.attachedMedia[0].filePath}`
						: undefined;

				Toast.info(
					`${lastJsonMessage.content.from} send you a message:
				${content.length > 120 ? `${content}...` : content}`
				).sendIfFocus(
					PushNotification.new(
						`New message from ${lastJsonMessage.content.from}`
					)
						.message(content)
						.image(mediaPath)
						.onClick(() => window.focus())
				);
				return;
			}

			dispatchMessages({
				type: MESSAGE_ACTIONS.ADD,
				data: {
					...lastJsonMessage.content.message,
					author: lastJsonMessage.content.from,
				},
			});

			setScrollTo('bottom');

			sendJsonMessage({
				action: WSSYSTEM.ACTION.MESSAGE.READ,
				chatID: selectedChat.chatId,
				target: selectedChat.targetId,
			});
		}
	);

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.READ, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;

		dispatchMessages({
			type: MESSAGE_ACTIONS.READ,
		});
		setScrollTo('none');
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.RECEIVED, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;

		dispatchMessages({ type: MESSAGE_ACTIONS.RECEIVED });
		setScrollTo('none');
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.DELETE, (lastJsonMessage) => {
		if (!doNotDisturbMode) {
			Toast.info(
				`${lastJsonMessage.content.from} deleted a message`
			).send();
		}
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;

		dispatchMessages({
			type: MESSAGE_ACTIONS.DELETE,
			data: lastJsonMessage.content.messageID,
		});
		setScrollTo('none');
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.REACTED, (lastJsonMessage) => {
		if (!doNotDisturbMode) {
			Toast.info(
				`${lastJsonMessage.content.from} reacted to a message`
			).send();
		}
		if (
			selectedChat.chatId !== lastJsonMessage.content.message.message.chat
		)
			return;

		dispatchMessages({
			type: MESSAGE_ACTIONS.REPLACE,
			data: lastJsonMessage.content.message.message,
		});
		setScrollTo('none');
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.EDITED, (lastJsonMessage) => {
		if (!doNotDisturbMode) {
			Toast.info(
				`${lastJsonMessage.content.message.message.author} edited a message`
			).send();
		}
		if (
			selectedChat.chatId !== lastJsonMessage.content.message.message.chat
		)
			return;

		dispatchMessages({
			type: MESSAGE_ACTIONS.REPLACE,
			data: lastJsonMessage.content.message.message,
		});
		setScrollTo('none');
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.TYPING.STARTED, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
		typingRef.current.innerText = `${lastJsonMessage.content.from.userName} is typing...`;
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.TYPING.STOPPED, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
		typingRef.current.innerText = '';
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.ONLINE, (lastJsonMessage) => {
		if (doNotDisturbMode) return;
		Toast.info(
			`${lastJsonMessage.content.from.userName} is now online`
		).send();
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.OFFLINE, (lastJsonMessage) => {
		if (doNotDisturbMode) return;
		Toast.info(
			`${lastJsonMessage.content.from.userName} is now offline`
		).send();
	});

	//scrolls to a message with the given index if it isn't
	//loading yet request the messages from the server
	const jumpToMessage = (i) => {
		if (!(i in messageRefs.current)) {
			sendJsonMessage({
				action: WSSYSTEM.ACTION.MESSAGE.GET._,
				chatID: selectedChat.chatId,
				start: messages[0].index - 1,
				amount: messages[0].index - i,
			});
		} else {
			try {
				messageRefs.current[i].scrollIntoView({ behavior: 'smooth' });
				messageRefs.current[i].classList.add('highlighted');
				messageRefs.current[i].addEventListener('animationend', () =>
					messageRefs.current[i].classList.remove('highlighted')
				);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const reactToMessage = (uuid) => {
		setReactedMessage(uuid);
	};

	const relateToMessage = (uuid) => {
		setRelated(uuid);
	};

	const editMessage = (uuid, newText) => {
		sendJsonMessage({
			action: WSSYSTEM.ACTION.MESSAGE.EDIT,
			chatID: selectedChat.chatId,
			messageID: uuid,
			newContent: newText,
		});
	};

	const deleteMessage = (uuid) => {
		sendJsonMessage({
			action: WSSYSTEM.ACTION.MESSAGE.DELETE,
			messageID: uuid,
			chatID: selectedChat.chatId,
		});
	};

	//scroll down
	const scrollDown = () => {
		bottomRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	//checks if the user scrolled completly down, if not display a arrow to scroll down faster
	const onScroll = () => {
		// debugger;
		if (
			messageScreenRef.current.scrollTop +
				messageScreenRef.current.clientHeight >=
			messageScreenRef.current.scrollHeight - 50
		) {
			setShowScrollDown(false);
		} else {
			setShowScrollDown(true);
		}

		if (messageScreenRef.current.scrollTop == 0) {
			if (messages.length === 0 || messages[0].index <= 0) return;
			sendJsonMessage({
				action: WSSYSTEM.ACTION.MESSAGE.GET._,
				chatID: selectedChat.chatId,
				start: messages[0].index - 1,
				amount: 50,
			});
		}
	};

	const onClicks = {
		onDelete: deleteMessage,
		onReact: reactToMessage,
		onRelate: relateToMessage,
		onEdit: editMessage,
	};

	return (
		<div className="message-screen">
			<div className="scroll-down" onClick={scrollDown}>
				{showScrollDown && (
					<IoArrowDown
						style={{
							stroke: 'url(#base-gradient)',
							fill: 'url(#base-gradient)',
						}}
					/>
				)}
			</div>
			<div className="profile">
				<div className="username">{other?.userName}</div>
				<div className="dot"></div>
				<div className="status">{other?.status}</div>
			</div>
			<div className="typing" ref={typingRef}></div>
			<div className="scroll" onScroll={onScroll} ref={messageScreenRef}>
				{messages.map((message, i) => (
					<React.Fragment key={i}>
						{i === 0 ? (
							<DayDivider
								date={message.sent}
								key={message.messageID}
							/>
						) : (
							!sameDay(
								new Date(message.sent),
								new Date(messages[i - 1].sent)
							) && <DayDivider date={message.sent} />
						)}
						<Message
							ref={(el) =>
								(messageRefs.current[message.index] = el)
							}
							uuid={message.messageID}
							index={message.index}
							you={message.author === you ? true : false}
							author={message.author}
							time={message.sent}
							read={message.status}
							reactions={message.reactions}
							onClicks={onClicks}
							message={message.content}
							moreOptions
							edited={message.edited}
						>
							<>
								{message.relatedTo && (
									<div className="answer">
										<Message
											uuid={message.relatedTo.uuid}
											you={
												message.relatedTo
													.relatedAuthor === you
													? true
													: false
											}
											author={
												message.relatedTo.relatedAuthor
											}
											time={message.relatedTo.sent}
											read={message.relatedTo.status}
											reactions={
												message.relatedTo.reactions
											}
											index={message.relatedTo.index}
											onClicks={{
												onMessage: jumpToMessage,
											}}
											message={message.relatedTo.content}
											edited={message.relatedTo.edited}
										>
											<>
												{message.relatedTo.attachedMedia
													.length !== 0 &&
													message.relatedTo.attachedMedia.map(
														(media) =>
															mapMedia(
																media.filePath,
																media.id
															)
													)}
											</>
										</Message>
									</div>
								)}

								{message.attachedMedia?.length !== 0 &&
									message.attachedMedia?.map((media) =>
										mapMedia(media.filePath, media.id)
									)}
							</>
						</Message>
					</React.Fragment>
				))}

				<div className="bottom-ref" ref={bottomRef}></div>
			</div>
		</div>
	);
}

/**
 * checks if to dates are on the same day
 * @param {Date} d1 first date
 * @param {Date} d2 second date
 * @returns {Boolean} if the are at the same day
 */
function sameDay(d1, d2) {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

/**
 * Checks the extension of a file and returns the corrensponding media element
 * @param {String} filePath path to the file
 * @param {String} id of a media
 * @returns {ReactElement} a media element which can handle the file extension
 */
function mapMedia(filePath, id) {
	const splitted = filePath.split('.');
	const type = splitted.pop();
	const name = splitted.pop().split('\\').pop();

	const fullPath = `${prefixDOMAIN}${DOMAIN}/assets${filePath}`;

	switch (type) {
		case 'jpeg':
		case 'jpg':
		case 'png':
		case 'gif':
			return <Image key={id} src={fullPath} alt={name} />;
		case 'mp4':
		case 'MOV':
		case 'mov':
			return <Video key={id} src={fullPath} />;
		case 'mp3':
		case 'm4a':
		case 'ogg':
		case 'webm':
		case 'wav':
			return <Audio src={fullPath} key={id} />;
		default:
			return <File key={id} name={name} />;
	}
}
