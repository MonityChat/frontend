import React, { useEffect, useState, useRef, useContext } from 'react';
import { IoArrowDown } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Message from './Message';
import DayDivider from './DayDivider';
import './Css/MessageScreen.css';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { ChatContext } from '../Messenger';
import { ReactContext, RelatedContext } from './Chat';
import { AiOutlineFileText } from 'react-icons/ai';
import {
	WEBSOCKET_URL,
	ACTION_GET_MESSAGE_LATEST,
	ACTION_MESSAGE_SEND,
	NOTIFICATION_MESSAGE_INCOMING,
	NOTIFICATION_MESSAGE_READ,
	NOTIFICATION_MESSAGE_RECEIVED,
	ACTION_MESSAGE_READ,
	ACTION_MESSAGE_DELETE,
	NOTIFICATION_USER_STARTED_TYPING,
	NOTIFICATION_USER_STOPPED_TYPING,
	ACTION_GET_MESSAGE,
	NOTIFICATION_MESSAGE_DELETE,
	NOTIFICATION_MESSAGE_REACTED,
	ACTION_MESSAGE_EDIT,
	NOTIFICATION_MESSAGE_EDITED,
	ACTION_MESSAGE_REACT,
} from '../../../Util/Websocket';
import Audio from './Audio';

export default function MessageScreen() {
	const [messages, setMessages] = useState([]);
	const [scrollTo, setScrollTo] = useState('bottom');
	const [you, setYou] = useState(localStorage.getItem('userName'));

	const [showScrollDown, setShowScrollDown] = useState(false);

	const messageRefs = useRef([]);
	const messageScreenRef = useRef();
	const bottomRef = useRef();
	const typingRef = useRef();

	const { selectedChat } = useContext(ChatContext);
	const { setReactedMessage } = useContext(ReactContext);
	const { setRelated } = useContext(RelatedContext);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	useEffect(() => {
		if (scrollTo === 'bottom') bottomRef.current.scrollIntoView();
		else messageRefs.current[scrollTo].scrollIntoView();

		setScrollTo('bottom');
	}, [messages]);

	useEffect(() => {
		if (lastJsonMessage === null) return;

		switch (lastJsonMessage.action) {
			case ACTION_GET_MESSAGE_LATEST: {
				setMessages(lastJsonMessage.content.messages.reverse());
				setScrollTo('bottom');
				break;
			}
			case ACTION_MESSAGE_SEND: {
				setMessages((prev) => [...prev, lastJsonMessage.content]);
				setScrollTo('bottom');
				break;
			}
			case ACTION_GET_MESSAGE: {
				setScrollTo(lastJsonMessage.content.messages[0].index + 1);
				setMessages((prev) => [
					...lastJsonMessage.content.messages.reverse(),
					...prev,
				]);
				break;
			}
			case ACTION_MESSAGE_DELETE: {
				//chekc if in this chat
				setMessages((prev) => {
					const deleted = prev.filter(
						(message) =>
							message.messageID !==
							lastJsonMessage.content.message
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
				break;
			}
			case ACTION_MESSAGE_REACT: {
				if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
				return;
			setMessages((prev) => {
				prev.forEach((message, i) => {
					if (
						message.messageID ===
						lastJsonMessage.content.message.messageID
					) {
						prev[i] = lastJsonMessage.content.message;
					}
				});

				return prev;
			});
			}
			case ACTION_MESSAGE_EDIT: {
				console.log('edit to message');
				//check if in this chat
			}
		}

		switch (lastJsonMessage.notification) {
			case NOTIFICATION_MESSAGE_INCOMING: {
				if (
					selectedChat.chatId !== lastJsonMessage.content.message.chat
				) {
					toast.info('new Message');
					break;
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
					action: ACTION_MESSAGE_READ,
					chatID: selectedChat.chatId,
					target: selectedChat.targetId,
				});
				break;
			}
			case NOTIFICATION_MESSAGE_READ: {
				if (selectedChat.chatId !== lastJsonMessage.content.chat)
					return;
				setMessages((prev) => {
					const newMessages = prev.map((message) => ({
						...message,
						status: 'READ',
					}));
					return [...newMessages];
				});
				break;
			}
			case NOTIFICATION_MESSAGE_RECEIVED: {
				if (selectedChat.chatId !== lastJsonMessage.content.chat)
					return;
				setMessages((prev) => {
					const newMessages = prev.map((message) => ({
						...message,
						status: 'RECEIVED',
					}));
					return [...newMessages];
				});
				break;
			}
			case NOTIFICATION_USER_STARTED_TYPING: {
				if (selectedChat.chatId !== lastJsonMessage.content.chat)
					return;
				typingRef.current.innerText = `${lastJsonMessage.content.from.userName} is typing...`;
				break;
			}
			case NOTIFICATION_USER_STOPPED_TYPING: {
				if (selectedChat.chatId !== lastJsonMessage.content.chat)
					return;
				typingRef.current.innerText = '';
				break;
			}
			case NOTIFICATION_MESSAGE_DELETE: {
				if (selectedChat.chatId !== lastJsonMessage.content.chat)
					return;
				setMessages((prev) => {
					const deleted = prev.filter(
						(message) =>
							message.messageID !==
							lastJsonMessage.content.messageID
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
				break;
			}
			case NOTIFICATION_MESSAGE_REACTED: {
				if (selectedChat.chatId !== lastJsonMessage.content.chat)
					return;
				setMessages((prev) => {
					prev.forEach((message, i) => {
						if (
							message.messageID ===
							lastJsonMessage.content.message.messageID
						) {
							prev[i] = lastJsonMessage.content.message;
						}
					});

					return prev;
				});
			}
			case NOTIFICATION_MESSAGE_EDITED: {
				console.log('a message was edited');
				//check if in this chat
				// if (selectedChat.chatId !== lastJsonMessage.content.chat)
				// 	return;
				// setMessages((prev) => {
				// 	prev.forEach((message, i) => {
				// 		if (
				// 			message.messageID ===
				// 			lastJsonMessage.content.message.messageID
				// 		) {
				// 			prev[i] = lastJsonMessage.content.message;
				// 		}
				// 	});

				// 	return prev;
				// });
			}
		}
	}, [lastJsonMessage]);

	const jumpToMessage = (i) => {
		console.log('jump to message');
		// messageRefs.current[i].scrollIntoView({ behavior: "smooth" });
		// messageRefs.current[i].classList.add("highlighted");
		// messageRefs.current[i].addEventListener("animationend", () =>
		//   messageRefs.current[i].classList.remove("highlighted")
		// );
	};

	const reactToMessage = (uuid) => {
		setReactedMessage(uuid);
	};

	const relateToMessage = (uuid) => {
		setRelated(uuid);
	};

	const editMessage = (uuid, newText) => {
		console.log('edit ' + newText);
		sendJsonMessage({
			action: ACTION_MESSAGE_EDIT,
			chatID: selectedChat.chatId,
			messageID: uuid,
			newContent: newText,
		});
	};

	const deleteMessage = (uuid) => {
		sendJsonMessage({
			action: ACTION_MESSAGE_DELETE,
			messageID: uuid,
			chatID: selectedChat.chatId,
		});
	};

	const scrollDown = () => {
		bottomRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	const onScroll = () => {
		if (
			messageScreenRef.current.scrollTop +
				messageScreenRef.current.clientHeight >=
			messageScreenRef.current.scrollHeight
		) {
			setShowScrollDown(false);
		} else {
			setShowScrollDown(true);
		}

		if (messageScreenRef.current.scrollTop == 0) {
			if (messages[0].index <= 0) return;
			sendJsonMessage({
				action: ACTION_GET_MESSAGE,
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
							<DayDivider date={message.sent} key={i + 100000} />
						) : (
							!sameDay(
								new Date(message.sent),
								new Date(messages[i - 1].sent)
							) && <DayDivider date={message.sent} />
						)}
						<Message
							ref={(el) => (messageRefs.current[i] = el)}
							key={i}
							uuid={message.messageID}
							index={i}
							you={message.author === you ? true : false}
							author={message.author}
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
										>
											<>
												{message.relatedTo.attachedMedia
													.length !== 0 &&
													message.relatedTo.attachedMedia.map(
														(media) => (
															<img
																src={`http://localhost:8808/assets${media.filePath}`}
																alt={media.id}
																className="image-media"
															/>
														)
													)}
											</>
										</Message>
									</div>
								)}

								{message.attachedMedia?.length !== 0 &&
									message.attachedMedia.map((media) => (
										<>
											{/* images and gifs */}
											<img
												src={`http://localhost:8808/assets${media.filePath}`}
												alt={media.id}
												className="image-media"
											/>
											{/* <div className="file">
									<AiOutlineFileText
										size={'clamp(2rem, 10vw ,5rem)'}
										fill="url(#base-gradient)"
									/>
									<div className="file-name">SIMON IST COOL</div>
								</div> */}
											{/* <div className="video">
								<video controls src='/src/image/Musicvideo.mp4'>
								</video>
								</div> */}
											{/* <Audio src={"/src/image/Aufnahme.mp3"}/> */}
										</>
									))}
							</>
						</Message>
					</>
				))}

				<div className="bottom-ref" ref={bottomRef}></div>
			</div>
		</div>
	);
}

function sameDay(d1, d2) {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

function fillwithDummyMessages(n) {
	const dummy = [];

	var sentences = [
		'Hey',
		'orem ipsum dolor sit amet consectetur adipisicing elit. Maiores soluta hic consectetur pariatur recusandae, alias quibusdam iusto dicta, perferendis laudantium delectus deserunt obcaecati excepturi odio doloribus quos. Accusamus, minus. Iste sapiente odio beatae aliquam, voluptate optio blanditiis repellat reiciendis corrupti dignissimos, at iure consectetur laboriosam quis ut autem officia aperiam, libero similique. Modi atque dolor vel deserunt doloremque minus sint, neque quis porro totam dolorem! Magni voluptatem accusantium rerum quam laborum commodi natus cum magnam libero et nemo quasi officia, doloremque cumque culpa atque saepe sequi corrupti non, recusandae id labore, dignissimos voluptate? Ipsum eligendi minus, nesciunt modi nobis dolore.',
		'so fat not even Dora can explore her',
		'so  fat I swerved to miss her and ran out of gas',
		'so fat she won “The Bachelor” because she all those other bitches',
		'is like Bazooka Joe, 5 cents a blow',
		'is like an ATM, open 24/7',
		'is like a championship ring, everybody puts a finger in her',
	];

	for (let i = 0; i < n; i++) {
		let message = {
			author: Math.random() > 0.5 ? 'Someone' : 'Mike',
			sent: Date.now() + (i + 1) * 10000000,
			content: sentences[Math.floor(Math.random() * sentences.length)],
			attachedMedia: [],
			related: false,
			reactions: [
				{ reaction: '😅', count: 2 },
				{ reaction: '😅', count: 0 },
			],
		};

		if (message.author === 'You') {
			if (Math.random() > 0.5) {
				message.read = true;
			}
		}

		if (i == 8) message.related = true;

		dummy.push(message);
	}

	return dummy;
}
