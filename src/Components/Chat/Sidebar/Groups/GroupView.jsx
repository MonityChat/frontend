import React, { useEffect, useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { WEBSOCKET_URL, ACTION_GROUP_GET } from '../../../../Util/Websocket.js';
import './Css/GroupView.css';
import Group from './Group';

export default function GroupView() {
	const [groups, setGroups] = useState(null);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	useEffect(() => {
		sendJsonMessage({
			action: ACTION_GROUP_GET,
		});
	}, []);

	useEffect(() => {
		if (lastJsonMessage === null) return;
		if (lastJsonMessage.action !== ACTION_GROUP_GET) return;

		const incomingGroups = lastJsonMessage.content.groups;

		if (incomingGroups.length === 0) {
			setGroups([]);
		} else {
			incomingGroups
				.sort((a, b) => {
					return a.numberOfUnreadMessages - b.numberOfUnreadMessages;
				})
				.reverse();

			setGroups(incomingGroups);
		}
	}, [lastJsonMessage]);

	const onGroupClick = (uuid) => {
		console.log('requesting messages for: ' + uuid);
		// sendJsonMessage({
		// 	// action: 'get_group_messages',
		// 	target: uuid,
		// });
	};

	return (
		<div className="group-view view">
			<h2 className="title">Groups</h2>
			<div className="scrollable">
				{groups === null ? (
					<div className="placeholder">Loading data...</div>
				) : groups.length === 0 ? (
					<></>
				) : (
					groups.map((group, i) => (
						<Group
							key={i}
							// uuid={group.uuid}
							// name={group.name}
							// shortStatus={group.shortStatus}
							// profilPicture={group.profilIamgeLocation}
							// numberOfUnreadMessages={group.messages}
							uuid={'12334435'}
							name={'Tom'}
							shortStatus={'listening'}
							profilPicture={'/src/image/Donut.png'}
							numberOfUnreadMessages={-1}
							onClick={onGroupClick}
						></Group>
					))
				)}
			</div>
		</div>
	);
}
