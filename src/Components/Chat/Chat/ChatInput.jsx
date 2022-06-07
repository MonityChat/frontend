import React, { useRef, useState, useContext } from "react";
import {
  IoSendOutline,
  IoDocumentTextOutline,
  IoImageOutline,
} from "react-icons/io5";
import { BiMicrophone } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import "./Css/ChatInput.css";
import Picker from "emoji-picker-react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { WEBSOCKET_URL } from "../../../Util/Websocket.js";
import { SettingsContext, MESSAGE_MODES } from "../../../App";

export default function ChatInput() {
  const [showEmoji, setShowEmoji] = useState(false);
  const messageRef = useRef();

  const { sendJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  const { messageMode } = useContext(SettingsContext);

  const onEmojiClicked = (e, emojiObject) => {
    messageRef.current.value += emojiObject.emoji;
    setShowEmoji(false);
  };

  const sendMessage = () => {
    const message = messageRef.current.value;
    messageRef.current.value = "";

    if (message.length <= 0) return;
    sendJsonMessage({ message });
  };

  const handleMessageInput = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey && messageMode === MESSAGE_MODES.ENTER_CTRL) {
        sendMessage();
      } else if (e.shiftKey && messageMode === MESSAGE_MODES.ENTER_SHIFT) {
        sendMessage();
      } else if (
        messageMode === MESSAGE_MODES.ENTER &&
        !e.ctrlKey &&
        !e.shiftKey
      ) {
        sendMessage();
      }
    }
  };

  return (
    <div className="chat-input">
      {showEmoji && (
        <Picker onEmojiClick={onEmojiClicked} searchPlaceholder={"Search..."} />
      )}

      <IoDocumentTextOutline
        className="chat-button"
        size={"3em"}
        style={{ stroke: "url(#base-gradient)" }}
      />
      <BiMicrophone
        className="chat-button"
        size={"3em"}
        style={{ fill: "url(#base-gradient)" }}
      />
      <IoImageOutline
        className="chat-button"
        size={"3em"}
        style={{ stroke: "url(#base-gradient)" }}
      />
      <BsEmojiSmile
        className="chat-button"
        size={"3em"}
        style={{ fill: "url(#base-gradient)" }}
        onClick={() => setShowEmoji(!showEmoji)}
      />
      <textarea
        rows={1}
        className="message-input"
        ref={messageRef}
        onKeyDown={handleMessageInput}
      ></textarea>

      <IoSendOutline
        className="chat-button send"
        size={"3em"}
        style={{ stroke: "url(#base-gradient)" }}
        onClick={sendMessage}
      />
    </div>
  );
}
