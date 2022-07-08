import React, { useEffect, useRef, useState } from "react";
import ContactStatus from "./ContactStatus";
import GroupStatus from "./GroupStatus";
import {
  ACTION_PROFILE_GET_OTHER,
  NOTIFICATION_USER_ONLINE,
  NOTIFICATION_USER_UPDATE_PROFILE,
  NOTIFICATION_USER_OFFLINE,
} from "../../../Util/Websocket";
import "./Css/StatusBar.css";
import useAction from './../../../Hooks/useAction';

/**
 * Third part of the main components.
 * It renders the sidebar on the left side and handles
 * which status should be displayed.
 * It listens for a new profile and will display it.
 */
export default function StatusBar() {
  const [opened, setOpened] = useState(false);
  const [currentContactStatus, setCurrentContactStatus] = useState(null);
  const [currentGroupStatus, setCurrentGroupStatus] = useState(null);

  const statusBarRef = useRef();

  useAction(ACTION_PROFILE_GET_OTHER, (lastJsonMessage) => {
    setCurrentContactStatus(lastJsonMessage.content);
  });
  useAction(NOTIFICATION_USER_ONLINE, (lastJsonMessage) => {
    setCurrentContactStatus(lastJsonMessage.content.from);
  });

  useAction(NOTIFICATION_USER_OFFLINE, (lastJsonMessage) => {
    setCurrentContactStatus(lastJsonMessage.content.from);
  });

  useAction(NOTIFICATION_USER_UPDATE_PROFILE, (lastJsonMessage) => {
    setCurrentContactStatus(lastJsonMessage.content.from);
  });

  useEffect(() => {
    statusBarRef.current.classList.toggle("opened", opened);
  }, [opened]);

  return (
    <div className="statusbar" ref={statusBarRef}>
      <div className="line" onClick={() => setOpened((prev) => !prev)}></div>
      <div className="content">
        {!currentContactStatus ? (
          <div className="placeholder">Currently nothing selected</div>
        ) : (
          <ContactStatus
            profileImage={currentContactStatus.profileImageLocation}
            userName={currentContactStatus.userName}
            uuid={currentContactStatus.uuid}
            status={currentContactStatus.status}
            lastOnline={currentContactStatus.lastSeen}
            shortStatus={currentContactStatus.shortStatus}
            description={currentContactStatus.description}
          />
        )}
      </div>
    </div>
  );
}
