import React from 'react';
import './Css/Contact.css';
import { ImBlocked } from 'react-icons/im';

export default function Contact({
	name,
	lastOnline,
	numberOfUnreadMessages,
	profilPicture,
}) {
	return (
		<div className="contact">
			<div className="profil-picture">
				<img src={profilPicture} alt="contact" />
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
						(numberOfUnreadMessages > 0 ? 'some' : numberOfUnreadMessages < 0 ? 'blocked' : 'none' )
					}
				>
					{numberOfUnreadMessages < 0 ? (
						<ImBlocked 	size={'100%'}
						style={{ fill: 'url(#base-gradient)'}}/>
					) : (
						numberOfUnreadMessages
					)}
				</div>
			</div>
		</div>
	);
}
