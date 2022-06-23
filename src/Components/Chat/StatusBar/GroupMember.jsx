import React from "react";

/**
 * Component for a member in a group status
 */
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
        <img src={profilePicture} alt="PP" className="blur" />
        <img src={profilePicture} alt="PP" className="normal" />
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
