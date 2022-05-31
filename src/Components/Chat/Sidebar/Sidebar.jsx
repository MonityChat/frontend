import React, { useState } from 'react';
import SettingsButton from './SettingsButton';
import GroupsButton from './GroupsButton';
import BaseGradient from './BaseGradient';
import ContactsButton from './Contacts/ContactsButton';
import SearchButton from './SearchButton';
import AddContactsButton from './AddContactsButton';
import BotsButton from './BotsButton';
import ProfileButton from './ProfileButton';
import './Css/Sidebar.css';
import Contact from './Contacts/Contact';

export default function Sidebar() {
	const [size, setSize] = useState('3rem');

	const [contacts, setContacts] = useState(generateDummyContact(4));

	return (
		<div className="sidebar" tabIndex={1}>
			<BaseGradient />
			<div className="buttons">
				<div className="menu top">
					<ProfileButton size={size} />
					<ContactsButton size={size} />
					<GroupsButton size={size} />
					<BotsButton size={size} />
				</div>
				<div className="menu bottom">
					<AddContactsButton size={size} />
					<SearchButton size={size} />
					<SettingsButton size={size} />
				</div>
			</div>

			<div className="content">
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
		</div>
	);
}

function generateDummyContact(n) {
	let contacts = [];

	for (let i = 0; i < n; i++) {
		const contact = {
			name: 'Fischer Tom',
			lastOnline: '10days',
			numberOfUnreadMessages: parseInt(Math.random() * 10 - 5),
			profilPicture:
				'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
		};
		contacts.push(contact);
	}

	return contacts;
}
