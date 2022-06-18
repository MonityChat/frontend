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
import { WEBSOCKET_URL, ACTION_MESSAGE_SEND } from "../../../Util/Websocket.js";
import { SettingsContext, MESSAGE_MODES } from "../../../App";
import { ChatContext } from "../Messenger";
import { RelatedContext } from "./Chat";

export default function ChatInput() {
  const [showEmoji, setShowEmoji] = useState(false);
  const [height, setHeight] = useState("4rem");

  const messageRef = useRef();

  const selectedChat = useContext(ChatContext);
  const { related } = useContext(RelatedContext);

  const { sendJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  const { messageMode } = useContext(SettingsContext);

  const onEmojiClicked = (e, emojiObject) => {
    messageRef.current.value += emojiObject.emoji;
    setShowEmoji(false);
    messageRef.current.focus();
  };

  const sendMessage = () => {
    const message = messageRef.current.value;
    messageRef.current.value = "";

    if (message.length <= 0) return;

    if (selectedChat.targetId === undefined) return;

    sendJsonMessage({
      action: ACTION_MESSAGE_SEND,
      target: selectedChat.targetId,
      embedID: "",
      content: message,
      sent: Date.now(),
      related: related >= 0 ? related : "",
    });
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
        e.preventDefault();
      }
    }
  };

  return (
    <div className="chat-input" style={{ height: height }}>
      {showEmoji && (
        <div onMouseLeave={() => setShowEmoji(true)}>
          <Picker
            onEmojiClick={onEmojiClicked}
            searchPlaceholder={"Search..."}
          />
        </div>
      )}
      <div className="file-select chat-button">
        <IoDocumentTextOutline
          size={"3em"}
          style={{ stroke: "url(#base-gradient)" }}
        />
        <input
          type="file"
          className="file-select-input"
          accept=".txt, .docx, .pdf"
        />
      </div>
      <BiMicrophone
        className="chat-button"
        size={"3em"}
        style={{ fill: "url(#base-gradient)" }}
      />
      <div className="image-select chat-button">
        <IoImageOutline
          size={"3em"}
          style={{ stroke: "url(#base-gradient)" }}
        />
        <input
          type="file"
          className="image-select-input"
          accept=".png, .jpeg, .jpg"
        />
      </div>
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
