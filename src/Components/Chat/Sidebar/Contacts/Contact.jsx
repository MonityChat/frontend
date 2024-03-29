import React from 'react';
import './Css/Contact.css';
import { ImBlocked } from 'react-icons/im';

/**
 * Component to display  a contact in the contact view
 */
export default function Contact({
	name,
	lastOnline,
	numberOfUnreadMessages,
	isBlocked,
	profilPicture,
	onClick,
	uuid,
	lastMessage,
	status,
}) {
	return (
		<div className="contact sidebar-item" onClick={() => onClick(uuid)}>
			<div className="profile-picture">
				<img
					src={`${prefixDOMAIN}${DOMAIN}/assets${profilPicture}`}
					alt="PP"
					className="blur"
				/>
				<img
					src={`${prefixDOMAIN}${DOMAIN}/assets${profilPicture}`}
					alt="PP"
					className="normal"
				/>
			</div>
			<div className="info">
				<h2 className="name" title={name}>
					{name}
				</h2>
				<span className="last-online">
					{status === 'offline'
						? `last online: ${
								new Date(lastOnline)
									.toLocaleString()
									.split(',')[0]
						  }`
						: status}
				</span>
				<div
					className={
						'news-status ' +
						(isBlocked
							? 'blocked'
							: numberOfUnreadMessages > 0
							? 'some'
							: 'none')
					}
				>
					<div className="circle"></div>
					{isBlocked ? (
						<ImBlocked
							className="blocked-icon"
							size={'100%'}
							style={{ fill: 'url(#base-gradient)' }}
						/>
					) : numberOfUnreadMessages >= 100 ? (
						<span>99+</span>
					) : (
						<span>
							{numberOfUnreadMessages > 0
								? numberOfUnreadMessages
								: ''}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
