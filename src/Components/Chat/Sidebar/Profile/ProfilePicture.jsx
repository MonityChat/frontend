import React, { forwardRef } from "react";
import "./Css/ProfilePicture.css";

function ProfilePicture({ path, status, children }, ref) {
  const reqeustFullScreen = (e) => {
    ref.current[1].requestFullscreen();
  };

  return (
    <div className="profile-picture">
      <div className="img-container" onClick={reqeustFullScreen}>
        <img
          src={`http://localhost:8808/assets${path}`}
          //   src={path}
          className="blur"
          alt="PP"
          ref={(el) => {
            ref.current[0] = el;
          }}
        />
        <img
          src={`http://localhost:8808/assets${path}`}
          // src={path}
          className="normal"
          alt="PP"
          ref={(el) => {
            ref.current[1] = el;
          }}
        />
      </div>
      <div className={`status ${status?.toLowerCase().replace(/_/, "-")}`}>
        <div className="outer"></div>
        <div className="middle"></div>
        <div className="inner"></div>
      </div>
      {children}
    </div>
  );
}

export default forwardRef(ProfilePicture);
