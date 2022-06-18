import React from 'react';

export default function GroupMember({
	userName,
	uuid,
	profilePicture,
	shortStatus,
	status,
	onClick,
}) {
	return (
		<div className="group-member sidebar-item" onClick={() => onClick(uuid)}>
			<div className="profile-picture">
				<img src={profilePicture} alt="PB" className="blur" />
				<img src={profilePicture} alt="PB" className="normal" />
				<div className="info">
					<h2 className="name" title={`${userName} | ${uuid}`}>
						{userName}
					</h2>
					<span className="short-status" title={shortStatus}>
						{shortStatus}
					</span>
				</div>
			</div>
		</div>
	);
}