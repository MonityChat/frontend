import React, { useContext, useState } from 'react';
import { BiMessageAdd } from 'react-icons/bi';
import {
	IoChatbubbleEllipsesOutline,
	IoCompassOutline,
	IoPeopleOutline,
	IoPersonAddOutline,
	IoSettingsOutline,
} from 'react-icons/io5';
import { ProfileContext } from '../Messenger';
import useAction from './../../../Hooks/useAction';
import { PushNotification, Toast } from './../../../Util/Toast';
import WSSYSTEM from './../../../Util/Websocket';
import BaseGradient from './../../General/BaseGradient';
import AddContactView from './AddContact/AddContactView';
import ContactView from './Contacts/ContactView';
import './Css/Sidebar.css';
import GroupView from './Groups/GroupView';
import ProfileButton from './Profile/ProfileButton';
import ProfileView from './Profile/ProfileView';
import RequestView from './Requests/RequestView';
import SearchView from './Search/SearchView';
import SettingsView from './Settings/SettingsView';
import SidebarButton from './SidebarButton';

/**
 * First part of the main components.
 * It renders the left sidebar and displays all the navigation.
 * It handles the rendering of all the sidebar views, depending
 * on the currently selected one.
 */
export default function Sidebar() {
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
			Toast.info(
				`New friend request from ${lastJsonMessage.content.from.userName}`
			).sendIfFocus(
				PushNotification.new('Incoming friend request')
					.message(
						`${lastJsonMessage.content.from.userName} send you a friend request`
					)
					.icon(
						`${prefixDOMAIN}${DOMAIN}/assets${lastJsonMessage.content.from.profileImageLocation}`
					)
					.onClick(() => window.focus())
			);
		}
	);

	useAction(
		WSSYSTEM.NOTIFICATION.REQUEST.FRIEND.ACCEPT,
		(lastJsonMessage) => {
			Toast.info(
				`${lastJsonMessage.content.from.userName} accepted your friend request`
			).sendIfFocus(
				PushNotification.new('Accepted friend request')
					.message(
						`your are no friends with ${lastJsonMessage.content.from.userName}`
					)
					.icon(
						`${prefixDOMAIN}${DOMAIN}/assets${lastJsonMessage.content.profileImageLocation}`
					)
					.onClick(() => window.focus())
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
						size={'3rem'}
						view={VIEWS.PROFILE}
						selected={VIEWS.PROFILE === view}
						profileImage={profile && profile?.profileImageLocation}
					/>
					<SidebarButton
						icon={IoChatbubbleEllipsesOutline}
						view={VIEWS.CONTACTS}
						selected={VIEWS.CONTACTS === view}
					/>
					<SidebarButton
						icon={IoPeopleOutline}
						view={VIEWS.GROUPS}
						selected={VIEWS.GROUPS === view}
					/>
				</div>
				<div className="menu bottom">
					{requests.length > 0 && (
						<SidebarButton
							icon={BiMessageAdd}
							view={VIEWS.NEW_REQUEST}
							selected={VIEWS.NEW_REQUEST === view}
						/>
					)}
					<SidebarButton
						icon={IoPersonAddOutline}
						view={VIEWS.ADD_CONTACT}
						selected={VIEWS.ADD_CONTACT === view}
					/>
					<SidebarButton
						icon={IoCompassOutline}
						view={VIEWS.SEARCH}
						selected={VIEWS.SEARCH === view}
					/>
					<SidebarButton
						icon={IoSettingsOutline}
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
