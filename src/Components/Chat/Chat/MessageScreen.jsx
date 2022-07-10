import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineFileText } from 'react-icons/ai';
import { IoArrowDown } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { ChatContext, ProfileContext } from '../Messenger';
import useAction from './../../../Hooks/useAction';
import WSSYSTEM from './../../../Util/Websocket';
import Audio from './Audio';
import { ReactContext, RelatedContext } from './Chat';
import './Css/MessageScreen.css';
import DayDivider from './DayDivider';
import Message from './Message/Message';

/**
 * Component for displaying all the messages.
 * It handles a lot of actions and notifications
 * coming from the server and displays the messages correctly.
 * It adds the divider between the messages and maps all the data
 * to the message like attached media.
 */
export default function MessageScreen() {
	const [messages, setMessages] = useState([]);
	const [scrollTo, setScrollTo] = useState('bottom');
	const [you, setYou] = useState(localStorage.getItem('userName'));

	const [showScrollDown, setShowScrollDown] = useState(false);

	const messageRefs = useRef({});
	const messageScreenRef = useRef();
	const bottomRef = useRef();
	const typingRef = useRef();

	const { selectedChat } = useContext(ChatContext);
	const { setReactedMessage } = useContext(ReactContext);
	const { setRelated } = useContext(RelatedContext);
	const profile = useContext(ProfileContext);

	//scroll to bottom of page
	useEffect(() => {
		if (scrollTo === 'bottom') bottomRef.current.scrollIntoView();
		else messageRefs.current[scrollTo].scrollIntoView();

		setScrollTo('bottom');
	}, [messages]);

	useEffect(() => {
		setYou(profile?.userName);
	}, [profile]);

	const { sendJsonMessage } = useAction();

	useAction(WSSYSTEM.ACTION.MESSAGE.GET.LATEST, (lastJsonMessage) => {
		if (!lastJsonMessage.content.messages) return;
		setMessages(lastJsonMessage.content.messages?.reverse());
		setScrollTo('bottom');
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.GET._, (lastJsonMessage) => {
		setScrollTo(lastJsonMessage.content.messages[0].index + 1);
		setMessages((prev) => [
			...lastJsonMessage.content.messages?.reverse(),
			...prev,
		]);
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.SEND, (lastJsonMessage) => {
		setMessages((prev) => [...prev, lastJsonMessage.content]);
		setScrollTo('bottom');
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.DELETE, (lastJsonMessage) => {
		setMessages((prev) => {
			const deleted = prev.filter(
				(message) =>
					message.messageID !== lastJsonMessage.content.message
			);

			deleted.forEach((message) => {
				if (
					message?.relatedTo &&
					message.relatedTo.messageID ===
						lastJsonMessage.content.message
				) {
					message.relatedTo = undefined;
				}
			});

			return deleted;
		});
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.REACT, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
			return;
		setMessages((prev) => {
			for (let i = 0; i < prev.length; i++) {
				if (
					prev[i].messageID ===
					lastJsonMessage.content.message.messageID
				) {
					prev[i] = lastJsonMessage.content.message;
				}

				if (
					prev[i].relatedTo?.messageID ===
					lastJsonMessage.content.message.messageID
				) {
					prev[i].relatedTo = lastJsonMessage.content.message;
				}
			}
			return [...prev];
		});
	});

	useAction(WSSYSTEM.ACTION.MESSAGE.EDIT, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
			return;
		setMessages((prev) => {
			for (let i = 0; i < prev.length; i++) {
				if (
					prev[i].messageID ===
					lastJsonMessage.content.message.messageID
				) {
					prev[i] = lastJsonMessage.content.message;
				}
				if (
					prev[i].relatedTo?.messageID ===
					lastJsonMessage.content.message.messageID
				) {
					prev[i].relatedTo = lastJsonMessage.content.message;
				}
			}
			return [...prev];
		});
	});

	useAction(
		WSSYSTEM.NOTIFICATION.MESSAGE.INCOMING,
		(lastJsonMessage, sendJsonMessage) => {
			if (selectedChat.chatId !== lastJsonMessage.content.message.chat) {
				if (profile.status === 'DO_NOT_DISTURB') return;
				const content = lastJsonMessage.content.message.content;
				toast.info(`${lastJsonMessage.content.from} send you a message:
			${content.length > 120 ? content.slice(0, 120) + '...' : content}`);
			}
			setMessages((prev) => [
				...prev,
				{
					...lastJsonMessage.content.message,
					author: lastJsonMessage.content.from,
				},
			]);

			bottomRef.current.scrollIntoView();

			sendJsonMessage({
				action: WSSYSTEM.ACTION.MESSAGE.READ,
				chatID: selectedChat.chatId,
				target: selectedChat.targetId,
			});
		}
	);

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.READ, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
		setMessages((prev) => {
			const newMessages = prev.map((message) => ({
				...message,
				status: 'READ',
			}));
			return [...newMessages];
		});
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.RECEIVED, (lastJsonMessage) => {
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
		setMessages((prev) => {
			const newMessages = prev.map((message) => ({
				...message,
				status: 'RECEIVED',
			}));
			return [...newMessages];
		});
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.DELETE, (lastJsonMessage) => {
		if (profile.status !== 'DO_NOT_DISTURB') {
			toast.info(`${lastJsonMessage.content.from} deleted a message`);
		}
		if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
		setMessages((prev) => {
			const deleted = prev.filter(
				(message) =>
					message.messageID !== lastJsonMessage.content.messageID
			);

			deleted.forEach((message) => {
				if (
					message?.relatedTo &&
					message.relatedTo.messageID ===
						lastJsonMessage.content.messageID
				) {
					message.relatedTo = undefined;
				}
			});

			return deleted;
		});
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.REACTED, (lastJsonMessage) => {
		if (profile.status !== 'DO_NOT_DISTURB') {
			toast.info(`${lastJsonMessage.content.from} reacted to a message`);
		}
		if (
			selectedChat.chatId !== lastJsonMessage.content.message.message.chat
		)
			return;
		setMessages((prev) => {
			for (let i = 0; i < prev.length; i++) {
				if (
					prev[i].messageID ===
					lastJsonMessage.content.message.message.messageID
				) {
					prev[i] = lastJsonMessage.content.message.message;
				}
				if (
					prev[i].relatedTo?.messageID ===
					lastJsonMessage.content.message.message.messageID
				) {
					prev[i].relatedTo = lastJsonMessage.content.message.message;
				}
			}
			return [...prev];
		});
	});

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.EDITED, (lastJsonMessage) => {
		if (profile.status !== 'DO_NOT_DISTURB') {
			toast.info(
				`${lastJsonMessage.content.message.message.author} edited a message`
			);
		}
		if (
			selectedChat.chatId !== lastJsonMessage.content.message.message.chat
		)
			return;
		setMessages((prev) => {
			for (let i = 0; i < prev.length; i++) {
				if (
					prev[i].messageID ===
					lastJsonMessage.content.message.message.messageID
				) {
					prev[i] = lastJsonMessage.content.message.message;
				}
				if (
					prev[i].relatedTo?.messageID ===
					lastJsonMessage.content.message.message.messageID
				) {
					prev[i].relatedTo = lastJsonMessage.content.message.message;
				}
			}
			return [...prev];
		});
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
		if (profile.status === 'DO_NOT_DISTURB') return;
		toast.info(`${lastJsonMessage.content.from.userName} is now offline`);
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.OFFLINE, (lastJsonMessage) => {
		if (profile.status === 'DO_NOT_DISTURB') return;
		toast.info(`${lastJsonMessage.content.from.userName} is now online`);
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
		}
		try {
			messageRefs.current[i].scrollIntoView({ behavior: 'smooth' });
			messageRefs.current[i].classList.add('highlighted');
			messageRefs.current[i].addEventListener('animationend', () =>
				messageRefs.current[i].classList.remove('highlighted')
			);
		} catch (err) {
			console.log(err);
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
			if (messages[0].index <= 0) return;
			sendJsonMessage({
				action: WSSYSTEM.ACTION.MESSAGE.GET._,
				chatID: selectedChat.chatId,
				start: messages[0].index - 1,
				amount: 50,
			});
		}
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
			<div className="typing" ref={typingRef}></div>
			<div className="scroll" onScroll={onScroll} ref={messageScreenRef}>
				{messages.map((message, i) => (
					<>
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
							key={i}
							uuid={message.messageID}
							index={message.index}
							you={message.author === you ? true : false}
							author={message.author} //...
							time={message.sent}
							read={message.status}
							reactions={message.reactions}
							onClicks={{
								onDelete: deleteMessage,
								onReact: reactToMessage,
								onRelate: relateToMessage,
								onEdit: editMessage,
							}}
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
									message.attachedMedia.map((media) =>
										mapMedia(media.filePath, media.id)
									)}
							</>
						</Message>
					</>
				))}

				<div className="bottom-ref" ref={bottomRef}></div>
			</div>
		</div>
	);
}

//checks if to dates are on the same day
function sameDay(d1, d2) {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

//returns the correct jsx depending on the filetype
function mapMedia(filePath, id) {
	const splitted = filePath.split('.');
	const type = splitted.pop();
	const name = splitted.pop().split('\\').pop();

	switch (type) {
		case 'jpeg':
		case 'jpg':
		case 'png':
		case 'gif':
			return (
				<img
					src={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`}
					alt={id}
					className="image-media"
					key={id}
				/>
			);
		case 'mp4':
		case 'MOV':
		case 'mov':
			return (
				<div className="video" key={id}>
					<video
						controls
						src={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`}
					></video>
				</div>
			);
		case 'mp3':
		case 'm4a':
		case 'ogg':
		case 'webm':
		case 'wav':
			return (
				<Audio
					src={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`}
					key={id}
				/>
			);
		default:
			return (
				<div className="file" key={id}>
					<a
						href={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`}
						target="blank"
					>
						<AiOutlineFileText
							size={'clamp(2rem, 10vw ,5rem)'}
							fill="url(#base-gradient)"
						/>
					</a>
					<div className="file-name">{name}</div>
				</div>
			);
	}
}
