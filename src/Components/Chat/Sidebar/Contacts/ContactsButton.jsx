import React from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

/**
 * Sidebarbutton to open the contactsview
 */
export default function ContactsButton({ size = "1em", view, selected }) {
  return (
    <div className={`sidebar-button ${selected ? "selected" : ""}`} view={view}>
      <IoChatbubbleEllipsesOutline
        size={size}
        style={{
          stroke: "url(#base-gradient)",
          fill: "url(#base-gradient)",
        }}
      />
    </div>
  );
}
