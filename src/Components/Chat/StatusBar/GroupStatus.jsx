import React, { useState } from 'react';
import ProfilePicture from '../Sidebar/Profile/ProfilePicture';
import './Css/GroupStatus.css';
import GroupMember from './GroupMember';

export default function GroupStatus({
	groupName,
	uuid,
	shortStatus,
	members,
	profileImage,
}) {
	const [selectedUser, setSelectedUser] = useState();

	const copyUUID = () => {
		navigator.clipboard.writeText(uuid);
	};
	members = [
		{ userName: 'Simon' },
		{ userName: 'Devin' },
		{ userName: 'Tom' },
	];
	return (
		<div className="group-status">
			<ProfilePicture path={profileImage} status={'NONE'} />
			<div className="group-name" title={groupName} onClick={copyUUID}>
				{groupName}
			</div>
			<span className="uuid">{uuid}</span>
			<div className="short-status">{shortStatus}</div>
			<div className="members">
				{members.map((member, i) => (
					<GroupMember
						profilePicture={'src/image/Donut.png'}
						userName={member.userName}
						shortStatus={'LIVE YOUNG'}
						status="ONLINE"
						key={i}
						uuid="132-2412-4-2"
						onClick={(uuid) =>
							setSelectedUser(
								members.find((member) => member.uuid === uuid)
							)
						}
					/>
				))}
			</div>
			<div className="selected">{selectedUser?.userName}</div>
		</div>
	);
}
