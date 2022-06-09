import React from "react";
import { IoCompassOutline } from "react-icons/io5";

export default function SearchButton({ size = "1em", view, selected }) {
  return (
    <div className={`sidebar-button ${selected ? "selected" : ""}`} view={view}>
      <IoCompassOutline
        size={size}
        style={{ stroke: "url(#base-gradient)", fill: "url(#base-gradient)" }}
      />
    </div>
  );
}
