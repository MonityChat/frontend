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
		<div className="add-contact sidebar-item" onClick={() => onClick(uuid)}>
			<div className="profile-picture">
				<img
					src={`http://localhost:8808/assets${profilePicture}`}
					// src={'/src/image/Donut.png'}
					alt="PB"
					className="blur"
				/>
				<img
					src={`http://localhost:8808/assets${profilePicture}`}
					// src={'/src/image/Donut.png'}
					alt="PB"
					className="normal"
				/>
			</div>
			<div className="info">
				<h2 className="name" title={`${name} | ${uuid}`}>
					{name}
				</h2>
				<span className="short-status" title={shortStatus}>
					{shortStatus}
				</span>
			</div>
		</div>
	);
}
