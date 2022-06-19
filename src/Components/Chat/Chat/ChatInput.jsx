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
import {
  WEBSOCKET_URL,
  ACTION_MESSAGE_SEND,
  FILE_UPLOAD_URL,
  ACTION_USER_TYPING,
} from "../../../Util/Websocket.js";
import useAuthentication from "../../../Util/UseAuth";
import { SettingsContext, MESSAGE_MODES } from "../../../App";
import { ChatContext } from "../Messenger";
import { RelatedContext } from "./Chat";

export default function ChatInput() {
  const [showEmoji, setShowEmoji] = useState(false);
  const [height, setHeight] = useState("4rem");
  const [images, setImages] = useState([]);

  const messageRef = useRef();

  const { selectedChat } = useContext(ChatContext);
  const { related, setRelated } = useContext(RelatedContext);

  const { sendJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  const { messageMode } = useContext(SettingsContext);

  const onEmojiClicked = (e, emojiObject) => {
    messageRef.current.value += emojiObject.emoji;
    setShowEmoji(false);
    messageRef.current.focus();
  };

  const sendMessage = async () => {
    const message = messageRef.current.value;
    messageRef.current.value = "";

    if (message.length <= 0 && images.length <= 0) return;

    if (selectedChat.targetId === undefined) return;

    let embedID = "";

    if (images.length > 0) {
      const [key] = useAuthentication();

      let formData = new FormData();
      formData.append("image", images[0]);

      const res = await fetch(
        `${FILE_UPLOAD_URL}?chatID=${selectedChat.chatId}&fileName=${images[0].name}&embedID=na`,
        {
          headers: {
            authorization: key,
          },
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) return;
      const { embedID: newEmbedID, path } = await res.json();

      if (images.length > 1) {
        for (let i = 0; i < images.length; i++) {
          if (i === 0) continue;
          let formData = new FormData();
          formData.append("image", images[i]);
          const res = await fetch(
            `${FILE_UPLOAD_URL}?chatID=${selectedChat.chatId}&fileName=${images[i].name}&embedID=${newEmbedID}`,
            {
              headers: {
                authorization: key,
              },
              method: "POST",
              body: formData,
            }
          );
        }
      }

      embedID = newEmbedID;
    }
    setTimeout(() => {
      sendJsonMessage({
        action: ACTION_MESSAGE_SEND,
        target: selectedChat.targetId,
        embedID: embedID,
        content: message,
        sent: Date.now(),
        related: related !== null ? related : "",
      });
      setRelated(null);
      setImages([]);
    }, 0);
  };

  const handleImageSelected = (e) => {
    const file = e.target.files[0];
    setImages((prev) => [...prev, file]);
  };

  const handleMessageInput = (e) => {
    if (selectedChat.chatId !== undefined) {
      sendJsonMessage({
        action: ACTION_USER_TYPING,
        target: selectedChat.targetId,
        chatID: selectedChat.chatId,
      });
    }

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
          accept=".png, .jpeg, .jpg, .gif, .mp4"
          onChange={handleImageSelected}
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
