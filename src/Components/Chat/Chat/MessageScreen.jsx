import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';
import DayDivider from './DayDivider';
import './Css/MessageScreen.css';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { WEBSOCKET_URL } from '../../../Util/Websocket';

export default function MessageScreen() {
	const [messages, setMessages] = useState([]);
	const [you, setYou] = useState('');

	const messageScreenRef = useRef();

	const {lastJsonMessage} = useWebSocket(WEBSOCKET_URL, {share: true});

	useEffect(() => {
		setMessages(fillwithDummyMessages(20));
		setYou('You');
		setTimeout(() => {
			messageScreenRef.current.scrollTop =
				messageScreenRef.current.scrollHeight;
		}, 0);
	}, []);

	useEffect(() => {

		if(lastJsonMessage === null) return;

		const message = lastJsonMessage.message;
		setMessages((messages) => [...messages, {
			author: Math.random() > 0.5 ? 'Someone' : 'You',
			time: Date.now(),
			content: message,
			read: false,
		}]);
		
	},[lastJsonMessage]);



	return (
		<div className="message-screen" ref={messageScreenRef}>
			<DayDivider date={new Date('May 24, 2022 03:24:00').getTime()} />
			{messages.map((message, index) => (
				<Message
					key={index}
					id={index}
					you={message.author === you ? true : false}
					author={message.author}
					time={message.time}
					read={message.read || false}
				>
					{message.content}
				</Message>
			))}
			<DayDivider date={Date.now()} />
			{messages.map((message, index) => (
				<Message
					key={index}
					id={index}
					you={message.author === you ? true : false}
					author={message.author}
					time={message.time}
					read={message.read || false}
				>
					{message.content}
				</Message>
			))}
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
