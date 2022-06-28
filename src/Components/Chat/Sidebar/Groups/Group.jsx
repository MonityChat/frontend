import React from "react";
import { ImBlocked } from "react-icons/im";
import "./Css/Group.css";

/**
 * Component to display  a group in the group view
 */
export default function Group({
  name,
  shortStatus,
  profilePicture,
  numberOfUnreadMessages,
  uuid,
  onClick,
}) {
  return (
    <div className="group sidebar-item" onClick={onClick(uuid)}>
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
        <div
          className={
            "news-status " +
            (numberOfUnreadMessages > 0
              ? "some"
              : numberOfUnreadMessages < 0
              ? "blocked"
              : "none")
          }
        >
          {numberOfUnreadMessages < 0 ? (
            <ImBlocked size={"100%"} style={{ fill: "url(#base-gradient)" }} />
          ) : (
            numberOfUnreadMessages
          )}
        </div>
      </div>
    </div>
  );
}
