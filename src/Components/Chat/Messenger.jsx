import React, { useEffect, useState, createContext } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Chat from "./Chat/Chat";
import StatusBar from "./StatusBar/StatusBar";
import "./Css/Messenger.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import useAuthentication from "../../Util/UseAuth";
import { WEBSOCKET_URL } from "../../Util/Websocket";

const ACTION_GET_SELF = "data:get:self";

export const ProfileContext = createContext();

export default function Messenger() {
  const [logedIn, setLogedIn] = useState(false);
  const [profile, setProfile] = useState();

  const history = useHistory();

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    const [key, , isLogedIn] = useAuthentication();
    // if (!isLogedIn) {
    //   console.log("is not loged in");
    //   // history.push('/authentication');
    //   // return;
    // }
    // console.log("is loged in");

    sendJsonMessage({
      auth: key,
      user: localStorage.getItem("userName"),
    });

    document.title = "Monity | Chat";
  }, []);

  useEffect(() => {
    if (lastJsonMessage === null) return;

    if (logedIn) return;

    if (lastJsonMessage.error !== "NONE") {
      console.log("doesn't has the permission");
      // history.push("/authentication");
      return;
    }
    setLogedIn(true);
    sendJsonMessage({ action: ACTION_GET_SELF });
  }, [lastJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage === null) return;
    if (lastJsonMessage.action !== ACTION_GET_SELF) return;

    setProfile(lastJsonMessage.content);
  }, [lastJsonMessage]);

  return (
    <ProfileContext.Provider value={profile}>
      <div className="messenger">
        <Sidebar />
        <div className="placeholder"></div>
        <Chat />
        <StatusBar />
      </div>
    </ProfileContext.Provider>
  );
}
