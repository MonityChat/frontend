import React from "react";
import "./Css/ProfileButton.css";

/**
 * Sidebarbutton to open the profileview
 * it also display's the profile picture of the user
 */
export default function ProfileButton({
  size = "1em",
  profileImage,
  view,
  selected,
}) {
  return (
    <div className={`sidebar-button ${selected ? "selected" : ""}`} view={view}>
      <div className="circle" style={{ "--circle-size": size }}>
        <div className="profile-picture">
          <img
            src={
              profileImage
                ? `${prefixDOMAIN}${DOMAIN}/assets${profileImage}`
                : `${prefixDOMAIN}${DOMAIN}/assets/images/monity/default.png`
            }
            alt=""
            className="blur"
          />
          <img
            src={
              profileImage
                ? `${prefixDOMAIN}${DOMAIN}/assets${profileImage}`
                : `${prefixDOMAIN}${DOMAIN}/assets/images/monity/default.png`
            }
            alt=""
            className="normal"
          />
        </div>
      </div>
    </div>
  );
}
