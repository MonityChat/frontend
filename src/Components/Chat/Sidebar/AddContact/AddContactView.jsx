import React, { useState } from 'react';
import AddContact from './AddContact';
import './Css/AddContactView.css';

export default function AddContactView() {
	const [searchedContacts, setSearchedContacts] = useState([
		{
			name: 'lorem ipsum',
			shortStatus: 'Crypto for life is best of the strongfsd Crypto for life is best of the strongfsdCrypto for life is best of the strongfsd Crypto for life is best of the strongfsd',
			profilPicture: 'https://i.pravatar.cc/300',
			uuid: '1234-213-123',
		},
		{
			name: 'lorem ipsum',
			shortStatus: 'ngfsd Crypto for life is best of the strongfsdCrypto for life is best of the strongfsd Crypto for life is best of the strongfsd',
			profilPicture: 'https://i.pravatar.cc/300',
			uuid: '1234-213-123',
		},
	]);

	return (
		<div className="add-contact-view">
			<h2 className="title">Add contact</h2>
			<input
				type="text"
				className="search"
				placeholder="Search contact"
			/>
			{searchedContacts.map((contact, i) => (
				<AddContact
					name={contact.name}
					shortStatus={contact.shortStatus}
					profilPicture={contact.profilPicture}
					uuid={contact.uuid}
					key={i}
				/>
			))}
		</div>
	);
}
