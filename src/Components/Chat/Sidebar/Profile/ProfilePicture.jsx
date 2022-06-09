import React from 'react';
import './Css/ProfilePicture.css';

export default function ProfilePicture({ path, status, children }) {
	return (
		<div className="profile-picture">
			<div className="img-container">
				<img src={path} alt="PB" />
			</div>
			<div
				className={`status ${status
					.toLowerCase()
					.replaceAll('_', '-')}`}
			>
				<div className="outer"></div>
				<div className="middle"></div>
				<div className="inner"></div>
			</div>
			{children}
		</div>
	);
}
