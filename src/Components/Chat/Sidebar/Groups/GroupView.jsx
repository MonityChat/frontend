import React, { useEffect, useState } from 'react';
import { ACTION } from '../../../../Util/Websocket.js';
import useAction from './../../../../Hooks/useAction';
import './Css/GroupView.css';
import Group from './Group';

/**
 * Component to render a sidebar view for your groups.
 * currently not supported
 */
export default function GroupView() {
	const [groups, setGroups] = useState(null);

	const { sendJsonMessage } = useAction(
		ACTION.GROUP.GET,
		(lastJsonMessage) => {
			const incomingGroups = lastJsonMessage.content.groups;

			if (incomingGroups.length === 0) {
				setGroups([]);
			} else {
				incomingGroups
					?.sort((a, b) => {
						return (
							a.numberOfUnreadMessages - b.numberOfUnreadMessages
						);
					})
					?.reverse();

				setGroups(incomingGroups);
			}
		}
	);

	useEffect(() => {
		sendJsonMessage({
			action: ACTION.GROUP.GET,
		});
	}, []);

	const onGroupClick = (uuid) => {
		console.log('requesting messages for: ' + uuid);
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
