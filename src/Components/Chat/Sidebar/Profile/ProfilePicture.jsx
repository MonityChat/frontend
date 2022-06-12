import React, { forwardRef } from "react";
import "./Css/ProfilePicture.css";

function ProfilePicture({ path, status, children }, ref) {
  return (
    <div className="profile-picture">
      <div className="img-container">
        <img
          src={`http://localhost:8808/assets${path}?${Date.now()}`}
          className="blur"
          alt="PB"
          ref={ref}
        />
        <img
          src={`http://localhost:8808/assets${path}?${Date.now()}`}
          className="normal"
          alt="PB"
          ref={ref}
        />
      </div>
      <div className={`status ${status.toLowerCase().replaceAll("_", "-")}`}>
        <div className="outer"></div>
        <div className="middle"></div>
        <div className="inner"></div>
      </div>
      {children}
    </div>
  );
}

export default forwardRef(ProfilePicture);
