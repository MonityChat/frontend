import React, { useState } from 'react';
import './Css/GroupView.css';
import Group from './Group';

export default function GroupView() {
	const [groups, setGroups] = useState();
	return (
		<div className="group-view">
			<h2 className="title">Groups</h2>
			<Group
				name={'tom'}
				shortStatus={'listening'}
				profilPicture={'https://i.pravatar.cc/300'}
                numberOfUnreadMessages={-1}
			></Group>
		</div>
	);
}
