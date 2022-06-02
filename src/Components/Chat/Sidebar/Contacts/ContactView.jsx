import React, { useState } from 'react';
import Contact from './Contact.jsx';
import './Css/ContactView.css';

export default function ContactView() {
	const [contacts, setContacts] = useState(generateDummyContact(5));
	return (
		<div className="contact-view">
			<h2 className="title">Contacts</h2>
			{contacts.map((contact, i) => (
				<Contact
					key={i}
					name={contact.name}
					lastOnline={contact.lastOnline}
					profilPicture={contact.profilPicture}
					numberOfUnreadMessages={contact.numberOfUnreadMessages}
				/>
			))}
		</div>
	);
}

function generateDummyContact(n) {
	let contacts = [];

	for (let i = 0; i < n; i++) {
		const contact = {
			name: 'Elon Musk',
			lastOnline: '10days',
			numberOfUnreadMessages: parseInt(Math.random() * 10 - 5),
			profilPicture:
				'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
		};
		contacts.push(contact);
	}

	return contacts;
}
