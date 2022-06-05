import React from 'react';
import { ImBlocked } from 'react-icons/im';
import './Css/Group.css';

export default function Group({
	name,
	shortStatus,
	profilPicture,
	numberOfUnreadMessages,
}) {
	return (
		<div>
			<div className="group">
				<div className="profil-picture">
					<img src={profilPicture} alt="contact" />
				</div>
				<div className="info">
					<h2 className="name">{name}</h2>
					<span className="short-status">{shortStatus}</span>
					<div
						className={
							'news-status ' +
							(numberOfUnreadMessages > 0
								? 'some'
								: numberOfUnreadMessages < 0
								? 'blocked'
								: 'none')
						}
					>
						{numberOfUnreadMessages < 0 ? (
							<ImBlocked
								size={'100%'}
								style={{ fill: 'url(#base-gradient)' }}
							/>
						) : (
							numberOfUnreadMessages
						)}
					</div>
				</div>
			</div>
		</div>
	);
}