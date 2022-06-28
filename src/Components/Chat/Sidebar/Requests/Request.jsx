import React from "react";
import "./Css/Request.css";

/**
 * Component to display a request in the request view
 */
export default function Request({
  name,
  profilePicture,
  uuid,
  onConfirm,
  onDecline,
  type,
}) {
  return (
    <div className="request sidebar-item">
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
        <span className="type">{type.toUpperCase()}</span>
        <div className="controll">
          <button
            className="confirm button-switch"
            onClick={() => onConfirm(uuid)}
          >
            Confirm
          </button>
          <button
            className="decline button-switch"
            onClick={() => onDecline(uuid)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
