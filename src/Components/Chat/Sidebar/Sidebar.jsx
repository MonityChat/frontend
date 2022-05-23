import React from 'react';
import SettingsButton from './SettingsButton';
import GroupsButton from './GroupsButton';
import BaseGradient from './BaseGradient';
import ChatsButton from './ChatsButton';
import SearchButton from './SearchButton';
import AddContactsButton from './AddContactsButton';
import BotsButton from './BotsButton';
import ProfileButton from './ProfileButton';
import './Css/Sidebar.css';

export default function Sidebar() {
	const size = '3em';

	return (
		<div className="sidebar" tabIndex={1}>
			<BaseGradient />

			<div className="menu top" >
				<ProfileButton size={size}/>
				<ChatsButton size={size} />
				<GroupsButton size={size} />
				<BotsButton size={size} />
			</div>
			<div className="menu bottom">
				<AddContactsButton size={size} />
				<SearchButton size={size} />
				<SettingsButton size={size} />
			</div>
		</div>
	);
}
