import React from "react";
import { BiMessageAdd } from "react-icons/bi";

/**
 * Sidebarbutton to open the requestview
 */
export default function NewRequestButton({ size = "1em", view, selected }) {
  return (
    <div className={`sidebar-button ${selected ? "selected" : ""}`} view={view}>
      <BiMessageAdd size={size} style={{ fill: "url(#base-gradient)" }} />
    </div>
  );
}
