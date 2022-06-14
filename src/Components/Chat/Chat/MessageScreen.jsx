import React, { useEffect, useState, useRef } from 'react';
import { IoArrowDown } from 'react-icons/io5';
import Message from './Message';
import DayDivider from './DayDivider';
import './Css/MessageScreen.css';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { WEBSOCKET_URL } from '../../../Util/Websocket';

export default function MessageScreen() {
	const [messages, setMessages] = useState(fillwithDummyMessages(5));
	const [you, setYou] = useState('');
	const [showScrollDown, setShowScrollDown] = useState(false);

	const messageRefs = useRef([]);
	const messageScreenRef = useRef();

	const { lastJsonMessage } = useWebSocket(WEBSOCKET_URL, { share: true });

	useEffect(() => {
		setMessages(fillwithDummyMessages(10));
		setYou('You');
	}, []);

	const jumpToMessage = (uuid) => {
		messageRefs.current[uuid].scrollIntoView();
		messageRefs.current[uuid].classList.add('highlighted');
		messageRefs.current[uuid].addEventListener('animationend', () =>
			messageRefs.current[uuid].classList.remove('highlighted')
		);
	};

	const scrollDown = () => {
		messageScreenRef.current.scrollTop =
			messageScreenRef.current.scrollHeight;
	};

	return (
		<div
			className="message-screen"
			ref={messageScreenRef}
			onLoad={() => {
				messageScreenRef.current.scrollTop =
					messageScreenRef.current.scrollHeight;
				messageScreenRef.current.style.scrollBehavior = 'smooth';
			}}
		>
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
			{messages.map((message, index) => (
				<Message
					ref={(el) => (messageRefs.current[index] = el)}
					key={index}
					uuid={index}
					you={message.author === you ? true : false}
					author={message.author}
					time={message.time}
					read={message.read || false}
					moreOptions
				>
					<>
						<img
							src="/src/image/Donut.png"
							alt=""
							className="image-media"
						/>
						<div>{message.content}</div>
					</>
				</Message>
			))}
			<DayDivider date={Date.now()} />
			<Message
				uuid={'913248124'}
				you={true}
				author={'Simon'}
				time={Date.now()}
				read={false}
				moreOptions
			>
				<>
					<div className="answer">
						<Message
							uuid={3}
							you={messages[3].author === you ? true : false}
							author={messages[3].author}
							time={messages[3].time}
							read={messages[3].read || false}
							onClick={jumpToMessage}
						>
							<>
								<img
									className="image-media"
									src="/src/image/Donut.png"
									alt=""
								/>
								<div>{messages[3].content}</div>
							</>
						</Message>
					</div>
					<div>I like it to my bro</div>
				</>
			</Message>
		</div>
	);
}

function fillwithDummyMessages(n) {
	const dummy = [];

	var sentences = [
		'orem ipsum dolor sit amet consectetur adipisicing elit. Maiores soluta hic consectetur pariatur recusandae, alias quibusdam iusto dicta, perferendis laudantium delectus deserunt obcaecati excepturi odio doloribus quos. Accusamus, minus. Iste sapiente odio beatae aliquam, voluptate optio blanditiis repellat reiciendis corrupti dignissimos, at iure consectetur laboriosam quis ut autem officia aperiam, libero similique. Modi atque dolor vel deserunt doloremque minus sint, neque quis porro totam dolorem! Magni voluptatem accusantium rerum quam laborum commodi natus cum magnam libero et nemo quasi officia, doloremque cumque culpa atque saepe sequi corrupti non, recusandae id labore, dignissimos voluptate? Ipsum eligendi minus, nesciunt modi nobis dolore.',
		'so fat not even Dora can explore her',
		'so  fat I swerved to miss her and ran out of gas',
		'so smelly she put on Right Guard and it went left',
		'so fat she hasn’t got cellulite, she’s got celluheavy',
		'so fat she don’t need no internet – she’s already world wide',
		'so hair her armpits look like Don King in a headlock',
		'so classless she could be a Marxist utopia',
		'so fat she can hear bacon cooking in Canada',
		'so fat she won “The Bachelor” because she all those other bitches',
		'so stupid she believes everything that Brian Williams says',
		'so ugly she scared off Flavor Flav',
		'is like Domino’s Pizza, one call does it all',
		'is twice the man you are',
		'is like Bazooka Joe, 5 cents a blow',
		'is like an ATM, open 24/7',
		'is like a championship ring, everybody puts a finger in her',
	];

	for (let i = 0; i < n; i++) {
		let message = {
			author: Math.random() > 0.5 ? 'Someone' : 'You',
			time: Date.now(),
			content: sentences[Math.floor(Math.random() * sentences.length)],
		};

		if (message.author === 'You') {
			if (Math.random() > 0.5) {
				message.read = true;
			}
		}

		dummy.push(message);
	}

	return dummy;
}
