import React from 'react';
import './Css/Contact.css';
import { ImBlocked } from 'react-icons/im';

export default function Contact({
	name,
	lastOnline,
	numberOfUnreadMessages,
	isBlocked,
	profilPicture,
	onClick,
}) {
	return (
		<div className="contact" onClick={() => onClick(name)}>
			<div className="profil-picture">
				<img src={profilPicture} alt="PB" />
			</div>
			<div className="info">
				<h2 className="name">{name}</h2>
				<span className="last-online">
					{lastOnline === 'online'
						? 'online'
						: `last online: ${lastOnline}`}
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
						<span>{numberOfUnreadMessages}</span>
					)}
				</div>
			</div>
		</div>
	);
}
