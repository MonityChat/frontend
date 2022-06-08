import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { HiOutlineUpload } from 'react-icons/hi';
import { ProfileContext } from '../../Messenger';
import ProfilePicture from './ProfilePicture';
import './Css/ProfileView.css';

export default function ProfileView() {
	const [editableShortStatus, setEditableShortStatus] = useState(false);
	const [editableDescription, setEditableDescription] = useState(false);

	let profile = useContext(ProfileContext);

	profile = {
		userName: 'Simon Devin von Braunschwieg',
		status: 'DO_NOT_DISTURB',
		description: 'SIMON is nice',
		lastSeen: Date.now(),
		uuid: '93489c5f-ff17-4e8d-b892-e572170c604a',
		shortStatus: 'Goat for gold',
		profileImageLocation: '/src/image/default.png',
	};

	const handleShortStatusChange = (e) => {
		if (!editableShortStatus) return;

		setEditableShortStatus(false);

		if (profile.shortStatus === e.target.value) return;

		const MAX_SHORT_STATUS_LENGTH = 128;
		if (
			e.target.value.length < 1 ||
			e.target.value.length > MAX_SHORT_STATUS_LENGTH
		) {
			e.target.value = profile.shortStatus;
			return;
		}

		console.log('new description:', e.target.value);
		//send ws message
	};

	const handleDescriptionChange = (e) => {
		if (!editableDescription) return;

		setEditableDescription(false);

		if (profile.description === e.target.value) return;

		if (e.target.value.length < 1) {
			e.target.value = profile.description;
			return;
		}
		console.log('new description:', e.target.value);
		//send ws message
	};

	const handleProfileImageSelected = (e) => {
		const file = e.target.files[0];

		if(!file) return;

		//upload image
	};

	return (
		<div className="profile-view view">
			<h2 className="title">Profile</h2>
			<div className="scrollable">
				{!profile ? (
					<div className="placeholder">Loading data...</div>
				) : (
					<>
						<ProfilePicture
							status={profile.status}
							path={profile.profileImageLocation}
						/>
						<div className="change-profile-picture">
							<input
								type="file"
								onChange={handleProfileImageSelected}
								accept="image/png, image/jpeg"
							/>
							<HiOutlineUpload
								style={{
									stroke: 'url(#base-gradient)',
								}}
							/>
						</div>
						<span className="user-name">{profile.userName}</span>
						<span className="uuid">{profile.uuid}</span>
						<div className="short-status-container">
							<h3>Short Status</h3>
							<input
								type="text"
								className="short-status"
								disabled={!editableShortStatus}
								defaultValue={profile.shortStatus}
								onMouseLeave={handleShortStatusChange}
							/>
							<AiOutlineEdit
								className="edit-icon"
								size="2rem"
								onClick={() => setEditableShortStatus(true)}
							/>
						</div>
						<div className="description-container">
							<h3>Description</h3>
							<textarea
								disabled={!editableDescription}
								className="description"
								onMouseLeave={handleDescriptionChange}
							>
								{profile.description}
							</textarea>
							<AiOutlineEdit
								className="edit-icon top"
								size="2rem"
								onClick={() => setEditableDescription(true)}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

const STATUS = Object.freeze({
	ONLINE: 'ONLINE',
	AWAY: 'AWAY',
	DO_NOT_DISTURB: 'DO_NOT_DISTURB',
	OFFLINE: 'OFFLINE',
});
