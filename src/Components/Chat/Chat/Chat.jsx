import React, { useState, createContext } from "react";

import ChatInput from "./ChatInput";
import MessageScreen from "./MessageScreen";
import "./Css/Chat.css";

export const RelatedContext = createContext();
// export const ReactContext = createContext();

export default function Chat() {
  const [related, setRelated] = useState("");
  // const [selectedEmoji, setSelectedEmoji] = useState("");
  // const [forceEmoji, setForceEmoji] = useState(false);

  return (
    <div className="chat">
      <RelatedContext.Provider value={{ related, setRelated }}>
        {/* <ReactContext.Provider
          value={{ selectedEmoji, setSelectedEmoji, forceEmoji, setForceEmoji }}
        > */}
        <MessageScreen />
        <ChatInput />
        {/* </ReactContext.Provider> */}
      </RelatedContext.Provider>
    </div>
  );
}
