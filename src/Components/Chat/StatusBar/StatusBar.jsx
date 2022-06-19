import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import ContactStatus from "./ContactStatus";
import GroupStatus from "./GroupStatus";
import {
  WEBSOCKET_URL,
  ACTION_PROFILE_GET_OTHER,
  NOTIFICATION_USER_ONLINE,
  NOTIFICATION_USER_UPDATE_PROFILE,
} from "../../../Util/Websocket";
import "./Css/StatusBar.css";

export default function StatusBar() {
  const [opened, setOpened] = useState(false);
  const [currentContactStatus, setCurrentContactStatus] = useState(null);
  const [currentGroupStatus, setCurrentGroupStatus] = useState(null);

  const statusBarRef = useRef();

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    statusBarRef.current.classList.toggle("opened", opened);
  }, [opened]);

  useEffect(() => {
    if (lastJsonMessage === null) return;
    if (lastJsonMessage.action === ACTION_PROFILE_GET_OTHER) {
      setCurrentContactStatus(lastJsonMessage.content);
    }

    switch (lastJsonMessage.notification) {
      case NOTIFICATION_USER_ONLINE: {
        setCurrentContactStatus(lastJsonMessage.content.from);
      }
      case NOTIFICATION_USER_UPDATE_PROFILE: {
        setCurrentContactStatus(lastJsonMessage.content.from);
      }
    }
  }, [lastJsonMessage]);

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
