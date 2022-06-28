import React, { useEffect, useState, useRef, useContext } from "react";
import { IoArrowDown } from "react-icons/io5";
import { toast } from "react-toastify";
import Message from "./Message";
import DayDivider from "./DayDivider";
import "./Css/MessageScreen.css";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { ChatContext } from "../Messenger";
import { ReactContext, RelatedContext } from "./Chat";
import { AiOutlineFileText } from "react-icons/ai";
import {
  WEBSOCKET_URL,
  ACTION_GET_MESSAGE_LATEST,
  ACTION_MESSAGE_SEND,
  NOTIFICATION_MESSAGE_INCOMING,
  NOTIFICATION_MESSAGE_READ,
  NOTIFICATION_MESSAGE_RECEIVED,
  ACTION_MESSAGE_READ,
  ACTION_MESSAGE_DELETE,
  NOTIFICATION_USER_STARTED_TYPING,
  NOTIFICATION_USER_STOPPED_TYPING,
  ACTION_GET_MESSAGE,
  NOTIFICATION_MESSAGE_DELETE,
  NOTIFICATION_MESSAGE_REACTED,
  ACTION_MESSAGE_EDIT,
  NOTIFICATION_MESSAGE_EDITED,
  ACTION_MESSAGE_REACT,
  NOTIFICATION_USER_ONLINE,
  NOTIFICATION_USER_OFFLINE,
} from "../../../Util/Websocket";
import { ProfileContext } from "../Messenger";
import Audio from "./Audio";

/**
 * Component for displaying all the messages.
 * It handles a lot of actions and notifications
 * coming from the server and displays the messages correctly.
 * It adds the divider between the messages and maps all the data
 * to the message like attached media.
 */
export default function MessageScreen() {
  const [messages, setMessages] = useState([]);
  const [scrollTo, setScrollTo] = useState("bottom");
  const [you, setYou] = useState(localStorage.getItem("userName"));

  const [showScrollDown, setShowScrollDown] = useState(false);

  const messageRefs = useRef({});
  const messageScreenRef = useRef();
  const bottomRef = useRef();
  const typingRef = useRef();

  const { selectedChat } = useContext(ChatContext);
  const { setReactedMessage } = useContext(ReactContext);
  const { setRelated } = useContext(RelatedContext);
  const profile = useContext(ProfileContext);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  //scroll to bottom of page
  useEffect(() => {
    if (scrollTo === "bottom") bottomRef.current.scrollIntoView();
    else messageRefs.current[scrollTo].scrollIntoView();

    setScrollTo("bottom");
  }, [messages]);

  //depending on the message modify the messages correctly
  useEffect(() => {
    if (lastJsonMessage === null) return;

    switch (lastJsonMessage.action) {
      case ACTION_GET_MESSAGE_LATEST: {
        if(!lastJsonMessage.content.messages)return;
        setMessages(lastJsonMessage.content.messages?.reverse());
        setScrollTo("bottom");
        break;
      }
      case ACTION_MESSAGE_SEND: {
        setMessages((prev) => [...prev, lastJsonMessage.content]);
        setScrollTo("bottom");
        break;
      }
      case ACTION_GET_MESSAGE: {
        setScrollTo(lastJsonMessage.content.messages[0].index + 1);
        setMessages((prev) => [
          ...lastJsonMessage.content.messages?.reverse(),
          ...prev,
        ]);
        break;
      }
      case ACTION_MESSAGE_DELETE: {
        setMessages((prev) => {
          const deleted = prev.filter(
            (message) => message.messageID !== lastJsonMessage.content.message
          );

          deleted.forEach((message) => {
            if (
              message?.relatedTo &&
              message.relatedTo.messageID === lastJsonMessage.content.message
            ) {
              message.relatedTo = undefined;
            }
          });

          return deleted;
        });
        break;
      }
      case ACTION_MESSAGE_REACT: {
        if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
          return;
        setMessages((prev) => {
          for (let i = 0; i < prev.length; i++) {
            if (
              prev[i].messageID === lastJsonMessage.content.message.messageID
            ) {
              prev[i] = lastJsonMessage.content.message;
            }

            if (
              prev[i].relatedTo?.messageID ===
              lastJsonMessage.content.message.messageID
            ) {
              prev[i].relatedTo = lastJsonMessage.content.message;
            }
          }
          return [...prev];
        });

        break;
      }
      case ACTION_MESSAGE_EDIT: {
        if (selectedChat.chatId !== lastJsonMessage.content.message.chat)
          return;
        setMessages((prev) => {
          for (let i = 0; i < prev.length; i++) {
            if (
              prev[i].messageID === lastJsonMessage.content.message.messageID
            ) {
              prev[i] = lastJsonMessage.content.message;
            }
            if (
              prev[i].relatedTo?.messageID ===
              lastJsonMessage.content.message.messageID
            ) {
              prev[i].relatedTo = lastJsonMessage.content.message;
            }
          }
          return [...prev];
        });
        break;
      }
    }

    switch (lastJsonMessage.notification) {
      case NOTIFICATION_MESSAGE_INCOMING: {
        if (selectedChat.chatId !== lastJsonMessage.content.message.chat) {
          if (profile.status === "DO_NOT_DISTURB") return;
          const content = lastJsonMessage.content.message.content;
          toast.info(`${lastJsonMessage.content.from} send you a message:
          ${content.length > 120 ? content.slice(0, 120) + "..." : content}`);
          break;
        }
        setMessages((prev) => [
          ...prev,
          {
            ...lastJsonMessage.content.message,
            author: lastJsonMessage.content.from,
          },
        ]);

        bottomRef.current.scrollIntoView();

        sendJsonMessage({
          action: ACTION_MESSAGE_READ,
          chatID: selectedChat.chatId,
          target: selectedChat.targetId,
        });
        break;
      }
      case NOTIFICATION_MESSAGE_READ: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        setMessages((prev) => {
          const newMessages = prev.map((message) => ({
            ...message,
            status: "READ",
          }));
          return [...newMessages];
        });
        break;
      }
      case NOTIFICATION_MESSAGE_RECEIVED: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        setMessages((prev) => {
          const newMessages = prev.map((message) => ({
            ...message,
            status: "RECEIVED",
          }));
          return [...newMessages];
        });
        break;
      }
      case NOTIFICATION_USER_STARTED_TYPING: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        typingRef.current.innerText = `${lastJsonMessage.content.from.userName} is typing...`;
        break;
      }
      case NOTIFICATION_USER_STOPPED_TYPING: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        typingRef.current.innerText = "";
        break;
      }
      case NOTIFICATION_MESSAGE_DELETE: {
        if (profile.status !== "DO_NOT_DISTURB") {
          toast.info(`${lastJsonMessage.content.from} deleted a message`);
        }
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        setMessages((prev) => {
          const deleted = prev.filter(
            (message) => message.messageID !== lastJsonMessage.content.messageID
          );

          deleted.forEach((message) => {
            if (
              message?.relatedTo &&
              message.relatedTo.messageID === lastJsonMessage.content.messageID
            ) {
              message.relatedTo = undefined;
            }
          });

          return deleted;
        });

        break;
      }
      case NOTIFICATION_MESSAGE_REACTED: {
        if (profile.status !== "DO_NOT_DISTURB") {
          //falls status auf nicht störe => nicht stören
          toast.info(`${lastJsonMessage.content.from} reacted to a message`);
        }
        if (
          //nur aktualisieren wenn der Benutzer gerade im chat ist
          selectedChat.chatId !== lastJsonMessage.content.message.message.chat
        )
          return;
        setMessages((prev) => {
          for (let i = 0; i < prev.length; i++) {
            //für jede Nachricht
            if (
              //ist es die gleiche Nachricht
              prev[i].messageID ===
              lastJsonMessage.content.message.message.messageID
            ) {
              prev[i] = lastJsonMessage.content.message.message; //wenn ja ändere sie
            }
            if (
              //selbes wie oben bei einer antwort
              prev[i].relatedTo?.messageID ===
              lastJsonMessage.content.message.message.messageID
            ) {
              prev[i].relatedTo = lastJsonMessage.content.message.message;
            }
          }
          return [...prev];
        });

        break;
      }
      case NOTIFICATION_MESSAGE_EDITED: {
        if (profile.status !== "DO_NOT_DISTURB") {
          toast.info(
            `${lastJsonMessage.content.message.message.author} edited a message`
          );
        }
        if (
          selectedChat.chatId !== lastJsonMessage.content.message.message.chat
        )
          return;
        setMessages((prev) => {
          for (let i = 0; i < prev.length; i++) {
            if (
              prev[i].messageID ===
              lastJsonMessage.content.message.message.messageID
            ) {
              prev[i] = lastJsonMessage.content.message.message;
            }
            if (
              prev[i].relatedTo?.messageID ===
              lastJsonMessage.content.message.message.messageID
            ) {
              prev[i].relatedTo = lastJsonMessage.content.message.message;
            }
          }
          return [...prev];
        });

        break;
      }
      case NOTIFICATION_USER_OFFLINE: {
        if (profile.status === "DO_NOT_DISTURB") return;
        toast.info(`${lastJsonMessage.content.from.userName} is now offline`);
        break;
      }
      case NOTIFICATION_USER_ONLINE: {
        if (profile.status === "DO_NOT_DISTURB") return;
        toast.info(`${lastJsonMessage.content.from.userName} is now online`);
        break;
      }
    }
  }, [lastJsonMessage]);

  //scrolls to a message with the given index if it isn't
  //loading yet request the messages from the server
  const jumpToMessage = (i) => {
    if (!(i in messageRefs.current)) {
      sendJsonMessage({
        action: ACTION_GET_MESSAGE,
        chatID: selectedChat.chatId,
        start: messages[0].index - 1,
        amount: messages[0].index - i,
      });
    }
    try {
      messageRefs.current[i].scrollIntoView({ behavior: "smooth" });
      messageRefs.current[i].classList.add("highlighted");
      messageRefs.current[i].addEventListener("animationend", () =>
        messageRefs.current[i].classList.remove("highlighted")
      );
    } catch (err) {
      console.log(err);
    }
  };

  const reactToMessage = (uuid) => {
    setReactedMessage(uuid);
  };

  const relateToMessage = (uuid) => {
    setRelated(uuid);
  };

  const editMessage = (uuid, newText) => {
    sendJsonMessage({
      action: ACTION_MESSAGE_EDIT,
      chatID: selectedChat.chatId,
      messageID: uuid,
      newContent: newText,
    });
  };

  const deleteMessage = (uuid) => {
    sendJsonMessage({
      action: ACTION_MESSAGE_DELETE,
      messageID: uuid,
      chatID: selectedChat.chatId,
    });
  };

  //scroll down
  const scrollDown = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  //checks if the user scrolled completly down, if not display a arrow to scroll down faster
  const onScroll = () => {
    if (
      messageScreenRef.current.scrollTop +
        messageScreenRef.current.clientHeight >=
      messageScreenRef.current.scrollHeight - 50
    ) {
      setShowScrollDown(false);
    } else {
      setShowScrollDown(true);
    }

    //Benutzer hat ganz nach oben gescrollt
    if (messageScreenRef.current.scrollTop == 0) {
      if (messages[0].index <= 0) return; //gibt es noch neue?
      sendJsonMessage({
        action: ACTION_GET_MESSAGE, //neue Nachrichten anfordern
        chatID: selectedChat.chatId,
        start: messages[0].index - 1, //von welchem index
        amount: 50,
      });
    }
  };

  return (
    <div className="message-screen">
      <div className="scroll-down" onClick={scrollDown}>
        {showScrollDown && (
          <IoArrowDown
            style={{
              stroke: "url(#base-gradient)",
              fill: "url(#base-gradient)",
            }}
          />
        )}
      </div>
      <div className="typing" ref={typingRef}></div>
      <div className="scroll" onScroll={onScroll} ref={messageScreenRef}>
        {messages.map((message, i) => (
          <>
            {i === 0 ? (
              <DayDivider date={message.sent} key={i + 100000} />
            ) : (
              !sameDay(
                new Date(message.sent),
                new Date(messages[i - 1].sent)
              ) && <DayDivider date={message.sent} />
            )}
            <Message
              ref={(el) => (messageRefs.current[message.index] = el)}
              key={i}
              uuid={message.messageID}
              index={message.index}
              you={message.author === you ? true : false}
              author={message.author} //...
              time={message.sent}
              read={message.status}
              reactions={message.reactions}
              onClicks={{
                onDelete: deleteMessage,
                onReact: reactToMessage,
                onRelate: relateToMessage,
                onEdit: editMessage,
              }}
              message={message.content}
              moreOptions
              edited={message.edited}
            >
              <>
                {message.relatedTo && (
                  <div className="answer">
                    <Message
                      uuid={message.relatedTo.uuid}
                      you={
                        message.relatedTo.relatedAuthor === you ? true : false
                      }
                      author={message.relatedTo.relatedAuthor}
                      time={message.relatedTo.sent}
                      read={message.relatedTo.status}
                      reactions={message.relatedTo.reactions}
                      index={message.relatedTo.index}
                      onClicks={{
                        onMessage: jumpToMessage,
                      }}
                      message={message.relatedTo.content}
                      edited={message.relatedTo.edited}
                    >
                      <>
                        {message.relatedTo.attachedMedia.length !== 0 &&
                          message.relatedTo.attachedMedia.map((media) =>
                            mapMedia(media.filePath, media.id)
                          )}
                      </>
                    </Message>
                  </div>
                )}

                {message.attachedMedia?.length !== 0 &&
                  message.attachedMedia.map((media) =>
                    mapMedia(media.filePath, media.id)
                  )}
              </>
            </Message>
          </>
        ))}

        <div className="bottom-ref" ref={bottomRef}></div>
      </div>
    </div>
  );
}

//checks if to dates are on the same day
function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

//returns the correct jsx depending on the filetype
function mapMedia(filePath, id) {
  const splitted = filePath.split(".");
  const type = splitted.pop();
  const name = splitted.pop().split("\\").pop();

  switch (type) {
    case "jpeg":
    case "jpg":
    case "png":
    case "gif":
      return (
        <img
          src={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`}
          alt={id}
          className="image-media"
          key={id}
        />
      );
    case "mp4":
      return (
        <div className="video" key={id}>
          <video
            controls
            src={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`}
          ></video>
        </div>
      );
    case "mp3":
    case "m4a":
    case "ogg":
    case "webm":
    case "wav":
      return (
        <Audio src={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`} key={id} />
      );
    default:
      return (
        <div className="file" key={id}>
          <a href={`${prefixDOMAIN}${DOMAIN}/assets${filePath}`} target="blank">
            <AiOutlineFileText
              size={"clamp(2rem, 10vw ,5rem)"}
              fill="url(#base-gradient)"
            />
          </a>
          <div className="file-name">{name}</div>
        </div>
      );
  }
}
