import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { HiOutlineUpload } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useAuthentication from '../../../../Hooks/UseAuth';
import Fetch from '../../../../Util/Fetch';
import { ACTION, URL } from '../../../../Util/Websocket';
import ProfilePicture from '../../../General/ProfilePicture';
import { ProfileContext } from '../../Messenger';
import useAction from './../../../../Hooks/useAction';
import './Css/ProfileView.css';
import { HTTP_METHOD } from './../../../../Util/Fetch';
import { Toast } from './../../../../Util/Toast';

/**
 * Component to render a sidebar view for your profile.
 * it displays your profile and lets you change it.
 * After a change, it will send the data to the server to save it
 */
export default function ProfileView() {
	const [editableShortStatus, setEditableShortStatus] = useState(false);
	const [editableDescription, setEditableDescription] = useState(false);

	const shortStatusRef = useRef();
	const descriptionRef = useRef();
	const profileImageRef = useRef(new Array(2));

	let profile = useContext(ProfileContext);

	useEffect(() => {
		if (!profile) return;

		shortStatusRef.current.value = profile.shortStatus;
		descriptionRef.current.value = profile.description;
	}, [profile]);

	const { sendJsonMessage } = useAction(ACTION.PROFILE.UPDATE, () => {
		toast.success('Successfully changed status');
	});

	const sendUpdateToServer = (shortStatus, description, status) => {
		sendJsonMessage({
			action: ACTION.PROFILE.UPDATE,
			shortStatus: shortStatus ?? profile.shortStatus,
			description: description ?? profile.description,
			status: status ?? profile.status,
		});
	};

	const handleStatusChange = (newStatus) => {
		if (newStatus === profile.status) return;

		sendUpdateToServer(undefined, undefined, newStatus);
	};

	const handleShortStatusChange = (e) => {
		if (!editableShortStatus) return;
		setEditableShortStatus(false);

		const MAX_SHORT_STATUS_LENGTH = 128;
		const newShortStatus = e.target.value;

		if (profile.shortStatus === newShortStatus) return;

		if (newShortStatus.length < 1) {
			e.target.value = profile.shortStatus;
			toast.error('Short Status must be at least 1 character long');
			return;
		}

		if (newShortStatus.length > MAX_SHORT_STATUS_LENGTH) {
			e.target.value = profile.shortStatus;
			toast.error("Short Status can't be longer than 128 character");
			return;
		}

		sendUpdateToServer(newShortStatus, undefined, undefined);
	};

	const handleDescriptionChange = (e) => {
		if (!editableDescription) return;
		setEditableDescription(false);

		const newDescription = e.target.value;

		if (profile.description === newDescription) return;

		if (newDescription.length < 1) {
			e.target.value = profile.description;
			toast.error('Description must be at least 1 character long');
			return;
		}

		sendUpdateToServer(undefined, newDescription, undefined);
	};

	const handleProfileImageSelected = async (e) => {
		const file = e.target.files[0];

		if (!file) return;

		let formData = new FormData();
		formData.append('image', file);

		const [key] = useAuthentication();

		const res = await Fetch.new(
			URL.UPLOAD.PROFILE_IMAGE,
			HTTP_METHOD.POST,
			{ uuid: profile.uuid }
		)
			.body(formData)
			.sendAndToast(
				'Uploading new Profile image...',
				undefined,
				'Something went wrong'
			);

		if (!res.ok) {
			Toast.error('Image could not be changed, something went wrong');
			return;
		}

		Toast.success('Profile image changed 👌').send();

		const newImageURL = await res.text();

		profileImageRef.current[0].src = `${prefixDOMAIN}${DOMAIN}/assets${newImageURL}`;
		profileImageRef.current[1].src = `${prefixDOMAIN}${DOMAIN}/assets${newImageURL}`;
		sendJsonMessage({
			action: ACTION.PROFILE.GET.SELF,
		});
	};

	const copyUUID = () => {
		navigator.clipboard.writeText(profile.uuid);
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
							ref={profileImageRef}
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

						<span
							className="user-name"
							onClick={copyUUID}
							title={profile.userName}
						>
							{profile.userName}
						</span>
						<span className="uuid">{profile.uuid}</span>
						<div className="status-container">
							<h3>Status</h3>
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
