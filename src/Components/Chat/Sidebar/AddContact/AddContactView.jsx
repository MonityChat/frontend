import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { debounce } from '../../../../Util/Helpers';
import { ACTION } from '../../../../Util/Websocket';
import useAction from './../../../../Hooks/useAction';
import ERROR from './../../../../Util/Errors';
import AddContact from './AddContact';
import './Css/AddContactView.css';

/**
 * Component to render a sidebar view for adding contacts.
 * it displays an input for searching
 * new contacts. To prevent sending too many messages to
 * the server while searching we use debouncing.
 * It basically only sends a message if the user doesn't type for a given time
 */
export default function AddContactView() {
	const [searchedContacts, setSearchedContacts] = useState([]);

	const { sendJsonMessage } = useAction(
		ACTION.CONTACT.SEARCH,
		(lastJsonMessage) => {
			setSearchedContacts(lastJsonMessage.content.users);
		}
	);

	useAction(ACTION.CONTACT.ADD, (lastJsonMessage) => {
		if (lastJsonMessage.content.error === ERROR.ALREADY_CONTACT) {
			toast.error('You are already in contact');
		} else if (lastJsonMessage.content.error === ERROR.ALREADY_SEND_REQUEST) {
			toast.error('You already send a request');
		} else {
			toast.info('Sent friend request');
		}
	});

	const searchInput = debounce((keyword) => {
		if (keyword.length < 3) {
			setSearchedContacts([]);
			return;
		}

		sendJsonMessage({
			action: ACTION.CONTACT.SEARCH,
			keyword,
		});
	});

	const sendFriendRequest = (uuid) => {
		sendJsonMessage({
			action: ACTION.CONTACT.ADD,
			target: uuid,
		});
	};

	return (
		<div className="add-contact-view view">
			<h2 className="title">Add contact</h2>
			<input
				type="text"
				className="search"
				placeholder="Search contact"
				onChange={(e) => searchInput(e.target.value)}
			/>
			<div className="scrollable">
				{searchedContacts.length === 0 ? (
					<span className="placeholder">No results</span>
				) : (
					searchedContacts.map((contact, i) => (
						<AddContact
							name={contact.userName}
							shortStatus={contact.shortStatus}
							profilePicture={contact.profileImageLocation}
							uuid={contact.uuid}
							onClick={sendFriendRequest}
							key={i}
						/>
					))
				)}
			</div>
		</div>
	);
}
