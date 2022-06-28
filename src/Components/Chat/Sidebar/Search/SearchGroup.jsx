import React from "react";
import "./Css/SearchGroup.css";

/**
 * Component to display a group in the search view
 */
export default function SearchGroup({
  name,
  shortStatus,
  profilePicture,
  uuid,
  onClick,
}) {
  return (
    <div className="search-group sidebar-item" onClick={() => onClick(uuid)}>
      <div className="profile-picture">
        <img
          src={`${prefixDOMAIN}${DOMAIN}/assets${profilePicture}`}
          alt="PP"
          className="blur"
        />
        <img
          src={`${prefixDOMAIN}${DOMAIN}/assets${profilePicture}`}
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
