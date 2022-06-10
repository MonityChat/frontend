import React from 'react';
import './Css/AddContact.css';

export default function AddContact({
	name,
	shortStatus,
	profilePicture,
	uuid,
	onClick,
}) {
	return (
		<div className="add-contact" onClick={() => onClick(uuid)}>
			<div className="profil-picture">
				<img
					src={`http://localhost:8808/assets${profilePicture}`}
					// src={profilePicture}
					alt="contact"
				/>
			</div>
			<div className="info">
				<h2 className="name">{name}</h2>
				<span
					className="short-status "
				>
					{shortStatus}
				</span>
			</div>
		</div>
	);
}
