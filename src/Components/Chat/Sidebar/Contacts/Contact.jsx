import React from "react";
import "./Css/Contact.css";
import { ImBlocked } from "react-icons/im";

export default function Contact({
  userName,
  lastOnline,
  numberOfUnreadMessages,
  isBlocked,
  profilPicture,
  onClick,
  uuid,
}) {
  return (
    <div className="contact sidebar-item" onClick={() => onClick(uuid)}>
      <div className="profile-picture">
        <img src={profilPicture} alt="PB" className="blur" />
        <img src={profilPicture} alt="PB" className="normal" />
      </div>
      <div className="info">
        <h2 className="name" title={userName}>
          {userName}
        </h2>
        <span className="last-online">
          {lastOnline === "online"
            ? "online"
            : `last online: ${
                new Date(lastOnline).toLocaleString().split(",")[0]
              }`}
        </span>
        <div
          className={
            "news-status " +
            (isBlocked
              ? "blocked"
              : numberOfUnreadMessages > 0
              ? "some"
              : "none")
          }
        >
          <div className="circle"></div>
          {isBlocked ? (
            <ImBlocked
              className="blocked-icon"
              size={"100%"}
              style={{ fill: "url(#base-gradient)" }}
            />
          ) : numberOfUnreadMessages >= 100 ? (
            <span>99+</span>
          ) : (
            <span>
              {numberOfUnreadMessages > 0 ? numberOfUnreadMessages : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
