import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ProfileContext } from '../Messenger';
import useAction from './../../../Hooks/useAction';
import WSSYSTEM from './../../../Util/Websocket';
import BaseGradient from './../../General/BaseGradient';
import AddContactsButton from './AddContact/AddContactsButton';
import AddContactView from './AddContact/AddContactView';
import ContactsButton from './Contacts/ContactsButton';
import ContactView from './Contacts/ContactView';
import './Css/Sidebar.css';
import GroupsButton from './Groups/GroupsButton';
import GroupView from './Groups/GroupView';
import ProfileButton from './Profile/ProfileButton';
import ProfileView from './Profile/ProfileView';
import NewRequestButton from './Requests/NewRequestButton';
import RequestView from './Requests/RequestView';
import SearchButton from './Search/SearchButton';
import SearchView from './Search/SearchView';
import SettingsButton from './Settings/SettingsButton';
import SettingsView from './Settings/SettingsView';

/**
 * First part of the main components.
 * It renders the left sidebar and displays all the navigation.
 * It handles the rendering of all the sidebar views, depending
 * on the currently selected one.
 */
export default function Sidebar() {
	const [size, setSize] = useState('3rem');
	const [view, setView] = useState(VIEWS.PROFILE);
	const [requests, setRequests] = useState([]);

	const profile = useContext(ProfileContext);

	useAction(WSSYSTEM.ACTION.PROFILE.GET.SELF, (_, sendJsonMessage) => {
		sendJsonMessage({
			action: WSSYSTEM.ACTION.CONTACT.GET.REQUEST,
		});
	});

	useAction(WSSYSTEM.ACTION.CONTACT.GET.REQUEST, (lastJsonMessage) => {
		setRequests(lastJsonMessage.content.requests || []);
	});

	useAction(
		WSSYSTEM.NOTIFICATION.REQUEST.FRIEND.INCOME,
		(lastJsonMessage) => {
			setRequests((prev) => [...prev, lastJsonMessage.content.from]);
			toast.info(
				`New friend request from ${lastJsonMessage.content.from.userName}`
			);
		}
	);

	useAction(
		WSSYSTEM.NOTIFICATION.REQUEST.FRIEND.ACCEPT,
		(lastJsonMessage) => {
			toast.info(
				`${lastJsonMessage.content.from.userName} accepted your friend request`
			);
		}
	);

	const removeRequest = (uuid) => {
		setRequests((prev) => prev.filter((request) => request.uuid !== uuid));
	};

	const handleButtonClick = (e) => {
		const target = e.target.closest('.sidebar-button');
		if (target === null) return;
		setView(target.getAttribute('view'));
	};

	return (
		<div className="sidebar" tabIndex={1}>
			<BaseGradient />
			<div className="buttons" onClick={handleButtonClick}>
				<div className="menu top">
					<ProfileButton
						size={size}
						view={VIEWS.PROFILE}
						selected={VIEWS.PROFILE === view}
						profileImage={profile && profile?.profileImageLocation}
					/>
					<ContactsButton
						size={size}
						view={VIEWS.CONTACTS}
						selected={VIEWS.CONTACTS === view}
					/>
					<GroupsButton
						size={size}
						view={VIEWS.GROUPS}
						selected={VIEWS.GROUPS === view}
					/>
				</div>
				<div className="menu bottom">
					{requests.length > 0 && (
						<NewRequestButton
							size={size}
							view={VIEWS.NEW_REQUEST}
							selected={VIEWS.NEW_REQUEST === view}
						/>
					)}
					<AddContactsButton
						size={size}
						view={VIEWS.ADD_CONTACT}
						selected={VIEWS.ADD_CONTACT === view}
					/>
					<SearchButton
						size={size}
						view={VIEWS.SEARCH}
						selected={VIEWS.SEARCH === view}
					/>
					<SettingsButton
						size={size}
						view={VIEWS.SETTINGS}
						selected={VIEWS.SETTINGS === view}
					/>
				</div>
			</div>

			<div className="content">
				{
					{
						[VIEWS.PROFILE]: <ProfileView />,
						[VIEWS.CONTACTS]: <ContactView />,
						[VIEWS.GROUPS]: <GroupView />,
						[VIEWS.NEW_REQUEST]: (
							<RequestView
								requests={requests}
								removeRequest={removeRequest}
							/>
						),
						[VIEWS.ADD_CONTACT]: <AddContactView />,
						[VIEWS.SEARCH]: <SearchView />,
						[VIEWS.SETTINGS]: <SettingsView />,
					}[view]
				}
			</div>
		</div>
	);
}

const VIEWS = Object.freeze({
	PROFILE: 'PROFILE',
	CONTACTS: 'CONTACTS',
	GROUPS: 'GROUPS',
	NEW_REQUEST: 'NEW_REQUEST',
	ADD_CONTACT: 'ADD_CONTACT',
	SEARCH: 'SEARCH',
	SETTINGS: 'SETTINGS',
});
