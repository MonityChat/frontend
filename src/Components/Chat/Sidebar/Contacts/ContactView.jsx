import React, { useEffect, useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import Contact from './Contact.jsx';
import {
	WEBSOCKET_URL,
	ACTION_CONTACT_GET,
	ACTION_MESSAGE_GET,
} from '../../../../Util/Websocket.js';
import './Css/ContactView.css';

export default function ContactView() {
	const [contacts, setContacts] = useState(null);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	useEffect(() => {
		sendJsonMessage({
			action: ACTION_CONTACT_GET,
		});
	}, []);

	useEffect(() => {
		if (lastJsonMessage === null) return;
		if (lastJsonMessage.action !== ACTION_CONTACT_GET) return;

		const incomingContacts = lastJsonMessage.content.contacts;

		if (incomingContacts.length === 0) {
			setContacts([]);
		} else {
			incomingContacts
				.sort((a, b) => {
					return a.numberOfUnreadMessages - b.numberOfUnreadMessages;
				})
				.reverse();

			setContacts(incomingContacts);
		}
	}, [lastJsonMessage]);

	const onContactClick = (uuid) => {
		console.log('requesting messages for: ' + uuid);
		sendJsonMessage({
			action: ACTION_MESSAGE_GET,
			target: uuid,
		});
	};

	return (
		<div className="contact-view view">
			<h2 className="title">Contacts</h2>
			<div className="scrollable">
				{contacts === null ? (
					<span className="placeholder">Loading data...</span>
				) : contacts.length === 0 ? (
					<></>
				) : (
					contacts.map((contact, i) => (
						<Contact
							key={i}
							// uuid={contact.uuid}
							// name={contact.name}
							// lastOnline={contact.lastOnline}
							// profilPicture={contact.profilPicture}
							// numberOfUnreadMessages={
							// 	contact.numberOfUnreadMessages
							// }
							// isBlocked={contact.isBlocked}
							uuid={'12345'}
							name={'Tom'}
							lastOnline={Date.now()}
							profilPicture={'src/image/Donut.png'}
							numberOfUnreadMessages={10}
							isBlocked={false}
							onClick={onContactClick}
						/>
					))
				)}
			</div>
		</div>
	);
}