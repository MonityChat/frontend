import React, { useState, useEffect, useContext, useRef } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { HiOutlineUpload } from 'react-icons/hi';
import { ProfileContext } from '../../Messenger';
import ProfilePicture from './ProfilePicture';
import './Css/ProfileView.css';

export default function ProfileView() {
	const [editableShortStatus, setEditableShortStatus] = useState(false);
	const [editableDescription, setEditableDescription] = useState(false);
	const [status, setStatus] = useState();

	const shortStatusRef = useRef();
	const descriptionRef = useRef();

	let profile = useContext(ProfileContext);

	useEffect(() => {
		if (!profile) return;

		shortStatusRef.current.value = profile.shortStatus;
		descriptionRef.current.value = profile.description;
		setStatus(profile.status);
	}, [profile]);

	const handleStatusChange = (newStatus) => {
		if (newStatus === profile.status) return;
		console.log(`status changed to ${newStatus}`);
		//send WS message to change status
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

		if (!file) return;

		//upload image
		let formData = new FormData();
		formData.append('image', file);
		console.log('formData:', formData);
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
						>
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
						</ProfilePicture>

						<span className="user-name">{profile.userName}</span>
						<span className="uuid">{profile.uuid}</span>
						<div className="status-container">
							<h3> Status</h3>
							<div className="circles">
								<div
									className={`circle online ${
										profile.status === STATUS.ONLINE
											? 'selected'
											: ''
									}`}
									onClick={() =>
										handleStatusChange(STATUS.ONLINE)
									}
								>
									<div className="outer"></div>
									<div className="middle"></div>
									<div className="inner"></div>
								</div>
								<div
									className={`circle away ${
										profile.status === STATUS.AWAY
											? 'selected'
											: ''
									}`}
									onClick={() =>
										handleStatusChange(STATUS.AWAY)
									}
								>
									<div className="outer"></div>
									<div className="middle"></div>
									<div className="inner"></div>
								</div>
								<div
									className={`circle do-not-disturb ${
										profile.status === STATUS.DO_NOT_DISTURB
											? 'selected'
											: ''
									}`}
									onClick={() =>
										handleStatusChange(
											STATUS.DO_NOT_DISTURB
										)
									}
								>
									<div className="outer"></div>
									<div className="middle"></div>
									<div className="inner"></div>
								</div>
								<div
									className={`circle offline ${
										profile.status === STATUS.OFFLINE
											? 'selected'
											: ''
									}`}
									onClick={() =>
										handleStatusChange(STATUS.OFFLINE)
									}
								>
									<div className="outer"></div>
									<div className="middle"></div>
									<div className="inner"></div>
								</div>
							</div>
						</div>
						<div className="short-status-container">
							<h3>Short Status</h3>
							<input
								type="text"
								className="short-status"
								ref={shortStatusRef}
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
								ref={descriptionRef}
								onMouseLeave={handleDescriptionChange}
								defaultValue={profile.description}	
							/>
							{/* </textarea> */}
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
