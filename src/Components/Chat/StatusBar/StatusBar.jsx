import React, { useEffect, useRef, useState } from 'react';
import useAction from './../../../Hooks/useAction';
import WSSYSTEM from './../../../Util/Websocket';
import ContactStatus from './ContactStatus';
import './Css/StatusBar.css';

/**
 * Third part of the main components.
 * It renders the sidebar on the left side and handles
 * which status should be displayed.
 * It listens for a new profile and will display it.
 */
export default function StatusBar() {
	const [opened, setOpened] = useState(false);
	const [currentContactStatus, setCurrentContactStatus] = useState(null);
	const [currentGroupStatus, setCurrentGroupStatus] = useState(null);

	const statusBarRef = useRef();

	useAction(WSSYSTEM.ACTION.PROFILE.GET.OTHER, (lastJsonMessage) => {
		setCurrentContactStatus(lastJsonMessage.content);
	});
	useAction(WSSYSTEM.NOTIFICATION.USER.ONLINE, (lastJsonMessage) => {
		setCurrentContactStatus(lastJsonMessage.content.from);
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.OFFLINE, (lastJsonMessage) => {
		setCurrentContactStatus(lastJsonMessage.content.from);
	});

	useAction(WSSYSTEM.NOTIFICATION.USER.PROFILE_UPDATE, (lastJsonMessage) => {
		setCurrentContactStatus(lastJsonMessage.content.from);
	});

	useEffect(() => {
		statusBarRef.current.classList.toggle('opened', opened);
	}, [opened]);

	return (
		<div className="statusbar" ref={statusBarRef}>
			<div
				className="line"
				onClick={() => setOpened((prev) => !prev)}
			></div>
			<div className="content">
				{!currentContactStatus ? (
					<div className="placeholder">
						Currently nothing selected
					</div>
				) : (
					<ContactStatus
						profileImage={currentContactStatus.profileImageLocation}
						userName={currentContactStatus.userName}
						uuid={currentContactStatus.uuid}
						status={currentContactStatus.status}
						lastOnline={currentContactStatus.lastSeen}
						shortStatus={currentContactStatus.shortStatus}
						description={currentContactStatus.description}
					/>
				)}
			</div>
		</div>
	);
}
