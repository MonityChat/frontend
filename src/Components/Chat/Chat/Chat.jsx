import React, { useState, createContext } from "react";

import ChatInput from "./ChatInput";
import MessageScreen from "./MessageScreen";
import "./Css/Chat.css";

/**
 * Context for the currently selected message which will be related/ answered to
 */
export const RelatedContext = createContext();

/**
 * Context for providing on which message the user is currently reacting
 */
export const ReactContext = createContext();

/**
 * Second component of the main components.
 * It displays the whole chat in the middle of the screen,
 * it renders the chat input bar and the message screen.
 */
export default function Chat() {
  const [related, setRelated] = useState("");
  const [reactedMessage, setReactedMessage] = useState("");

  return (
    <div className="chat">
      <RelatedContext.Provider value={{ related, setRelated }}>
        <ReactContext.Provider value={{ reactedMessage, setReactedMessage }}>
          <MessageScreen />
          <ChatInput />
        </ReactContext.Provider>
      </RelatedContext.Provider>
    </div>
  );
}
