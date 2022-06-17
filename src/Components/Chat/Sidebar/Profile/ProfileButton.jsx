import React from "react";
import "./Css/ProfileButton.css";

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
                ? `http://localhost:8808/assets${profileImage}`
                : `http://localhost:8808/assets/images/monity/default.png`
            }
            // src="/src/image/Donut.png"
            alt=""
            className="blur"
          />
          <img
            src={
              profileImage
                ? `http://localhost:8808/assets${profileImage}`
                : `http://localhost:8808/assets/images/monity/default.png`
            }
            // src="/src/image/Donut.png"
            alt=""
            className="normal"
          />
        </div>
      </div>
    </div>
  );
}
