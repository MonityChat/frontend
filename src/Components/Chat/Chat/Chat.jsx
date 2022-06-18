import React, { useState, createContext } from "react";

import ChatInput from "./ChatInput";
import MessageScreen from "./MessageScreen";
import "./Css/Chat.css";

export const RelatedContext = createContext();

export default function Chat() {
  const [related, setRelated] = useState(-1);

  return (
    <div className="chat">
      <RelatedContext.Provider value={{ related, setRelated }}>
        <MessageScreen />
        <ChatInput />
      </RelatedContext.Provider>
    </div>
  );
}
