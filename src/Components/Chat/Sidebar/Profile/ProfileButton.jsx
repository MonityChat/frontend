import React from "react";

export default function ProfileButton({
  size = "1em",
  picture,
  view,
  selected,
}) {
  return (
    <div className={`sidebar-button ${selected ? "selected" : ""}`} view={view}>
      <div className="circle" style={{ "--circle-size": size }}>
        <img
          src={
            `http://localhost:8808/assets${picture}?${Date().now()}` || `http://localhost:8808/assets/images/monity/default.png`
          }
        />
      </div>
    </div>
  );
}
