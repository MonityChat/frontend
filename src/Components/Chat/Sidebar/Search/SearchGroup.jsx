import React from 'react';
import './Css/SearchGroup.css';

export default function SearchGroup({
	name,
	shortStatus,
	profilePicture,
	uuid,
	onClick,
}) {
	return (
		<div
			className="search-group sidebar-item"
			onClick={() => onClick(uuid)}
		>
			<div className="profile-picture">
				<img
					src={`http://localhost:8808/assets${profilePicture}`}
					// src={'/src/image/Donut.png'}
					alt="PP"
					className="blur"
				/>
				<img
					src={`http://localhost:8808/assets${profilePicture}`}
					// src={'/src/image/Donut.png'}
					alt="PP"
					className="normal"
				/>
			</div>
			<div className="info">
				<h2 className="name" title={name}>
					{name}
				</h2>
				<span className="short-status" title={shortStatus}>
					{shortStatus}
				</span>
			</div>
		</div>
	);
}
