import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../Messenger';
import useAction from './../../../../Hooks/useAction';
import WSSYSTEM from './../../../../Util/Websocket';
import Contact from './Contact.jsx';
import './Css/ContactView.css';

/**
 * Component to render a sidebar view for your contacts.
 * it gets all the data from the Websocket connection and
 * displays it accordingly.
 * On clicking a contact it will make a acion to the server and give it
 * the corresponding chatid and targetid
 */
export default function ContactView() {
	const [contacts, setContacts] = useState(null);

	const { selectedChat, setSelectedChat } = useContext(ChatContext);

	const { sendJsonMessage } = useAction(
		WSSYSTEM.ACTION.CONTACT.GET._,
		(lastJsonMessage) => {
			const incomingContacts = lastJsonMessage.content.contacts;

			if (incomingContacts.length === 0) {
				setContacts([]);
			} else {
				incomingContacts
					?.sort((a, b) => {
						return a.unreadMessages - b.unreadMessages;
					})
					?.reverse();

				setContacts(incomingContacts);
			}
		}
	);

	useAction(WSSYSTEM.NOTIFICATION.MESSAGE.INCOMING, (lastJsonMessage) => {
		const inChatID = lastJsonMessage.content.chatID;
		if (inChatID === selectedChat.chatId) return;
		setContacts((prev) =>
			prev.map((contact) =>
				contact.chatID === inChatID
					? {
							...contact,
							unreadMessages: contact.unreadMessages + 1,
					  }
					: contact
			)
		);
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.ONLINE, (lastJsonMessage) => {
		const newUser = lastJsonMessage.content.from;
		setContacts((prev) => [
			...prev?.filter((contact) => contact.uuid !== newUser.uuid),
			newUser,
		]);
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.OFFLINE, (lastJsonMessage) => {
		const newUser = lastJsonMessage.content.from;
		setContacts((prev) => [
			...prev?.filter((contact) => contact.uuid !== newUser.uuid),
			newUser,
		]);
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.PROFILE_UPDATE, (lastJsonMessage) => {
		const newUser = lastJsonMessage.content.from;
		setContacts((prev) => [
			...prev?.filter((contact) => contact.uuid !== newUser.uuid),
			newUser,
		]);
	});

	useEffect(() => {
		sendJsonMessage({
			action: WSSYSTEM.ACTION.CONTACT.GET._,
		});
	}, []);

	const onContactClick = (uuid) => {
		const chatId =
			contacts.find((contact) => contact.uuid === uuid).chatID || '';
		sendJsonMessage({
			action: WSSYSTEM.ACTION.MESSAGE.GET.LATEST,
			chatID: chatId,
		});

		sendJsonMessage({
			action: WSSYSTEM.ACTION.PROFILE.GET.OTHER,
			target: uuid,
		});

		setContacts((prev) => {
			prev.forEach((contact) => {
				if (contact.uuid === uuid) {
					contact.unreadMessages = 0;
				}
			});
			return prev;
		});

		setSelectedChat((prev) => ({
			...prev,
			chatId: chatId,
			targetId: uuid,
		}));

		localStorage.setItem('lastChat', chatId);
		localStorage.setItem('lastUser', uuid);
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
							uuid={contact.uuid}
							name={contact.userName}
							lastOnline={contact.lastSeen}
							profilPicture={contact.profileImageLocation}
							numberOfUnreadMessages={contact.unreadMessages}
							isBlocked={contact.isBlocked}
							lastMessage={contact.lastUnread?.content}
							status={contact.status
								.toLowerCase()
								.replace(/_/g, ' ')}
							onClick={onContactClick}
						/>
					))
				)}
			</div>
		</div>
	);
}
