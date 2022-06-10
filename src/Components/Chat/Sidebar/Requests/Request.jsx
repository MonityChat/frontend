import React from 'react';
import './Css/Request.css';

export default function Request({
	name,
	profilePicture = 'src/image/default.png',
    uuid,
	onConfirm,
	onDecline,
	timestamp,
}) {
	return (
		<div className="request">
			<div className="profil-picture">
				<img src={'src/image/default.png'} alt="PB" />
			</div>
			<div className="info">
				<h2 className="name">{name}</h2>
				<span className="send-time">
					{new Date(timestamp).toLocaleString()}
				</span>
				<button onClick={() => onConfirm(uuid)}>Confirm</button>
				<button onClick={() => onDecline(uuid)}>Decline</button>
			</div>
		</div>
	);
}
